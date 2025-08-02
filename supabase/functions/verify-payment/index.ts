import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    // Validate Stripe key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseService.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Authentication failed");
    }

    const user = userData.user;

    // Initialize Stripe and get session
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Get purchase record
      const { data: purchase, error: purchaseError } = await supabaseService
        .from("gem_purchases")
        .select("*")
        .eq("stripe_session_id", session_id)
        .eq("user_id", user.id)
        .single();

      if (purchaseError || !purchase) {
        throw new Error("Purchase record not found");
      }

      if (purchase.status === "pending") {
        // Update purchase status
        await supabaseService
          .from("gem_purchases")
          .update({ status: "completed" })
          .eq("id", purchase.id);

        // Add gems to user profile
        const { data: profile, error: profileError } = await supabaseService
          .from("profiles")
          .select("gem_balance")
          .eq("user_id", user.id)
          .single();

        if (!profileError && profile) {
          await supabaseService
            .from("profiles")
            .update({ 
              gem_balance: profile.gem_balance + purchase.gem_amount 
            })
            .eq("user_id", user.id);
        }

        return new Response(JSON.stringify({ 
          success: true, 
          gems_added: purchase.gem_amount,
          message: `Successfully added ${purchase.gem_amount} gems to your account!`
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else {
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Payment already processed"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Payment not completed"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Payment verification failed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});