/**
 * Firebase Cloud Function for Stripe Checkout Session Creation
 * Deploy this to Firebase Functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { priceId, userId, gems, amount } = data;

    // Validate input
    if (!priceId || !userId || !gems || !amount) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: context.auth.token.email,
      metadata: {
        userId: userId,
        gems: gems.toString(),
        priceId: priceId
      },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${gems} Gems`,
            images: ['https://your-domain.com/gem-icon.png'],
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${functions.config().app.url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${functions.config().app.url}/gem-purchase`,
    });

    // Store pending purchase in Firestore
    await admin.firestore().collection('pending_purchases').doc(session.id).set({
      userId: userId,
      gems: gems,
      amount: amount,
      priceId: priceId,
      status: 'pending',
      created: admin.firestore.FieldValue.serverTimestamp()
    });

    return { sessionUrl: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});

exports.handlePaymentSuccess = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { sessionId } = data;
    
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const { userId, gems } = session.metadata;
      
      // Update user's gem balance in Firestore
      const userRef = admin.firestore().collection('users').doc(userId);
      await userRef.update({
        gems: admin.firestore.FieldValue.increment(parseInt(gems))
      });
      
      // Mark purchase as completed
      await admin.firestore().collection('pending_purchases').doc(sessionId).update({
        status: 'completed',
        completed: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true, gems: parseInt(gems) };
    }
    
    throw new functions.https.HttpsError('failed-precondition', 'Payment not completed');
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process payment');
  }
});

// Webhook handler for Stripe events (optional but recommended)
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, functions.config().stripe.webhook_secret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const { userId, gems } = session.metadata;
      
      // Update user's gem balance
      await admin.firestore().collection('users').doc(userId).update({
        gems: admin.firestore.FieldValue.increment(parseInt(gems))
      });
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});