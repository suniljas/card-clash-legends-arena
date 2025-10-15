import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        rarity: {
          common: "hsl(var(--common))",
          uncommon: "hsl(var(--uncommon))",
          rare: "hsl(var(--rare))",
          epic: "hsl(var(--epic))",
          legend: "hsl(var(--legend))",
          "ultra-legend": "hsl(var(--ultra-legend))",
        },
        game: {
          health: "hsl(var(--health))",
          attack: "hsl(var(--attack))",
          experience: "hsl(var(--experience))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px hsl(var(--primary) / 0.6)",
          },
        },
        "card-flip": {
          "0%": {
            transform: "perspective(1000px) rotateY(0deg)",
          },
          "50%": {
            transform: "perspective(1000px) rotateY(90deg)",
          },
          "100%": {
            transform: "perspective(1000px) rotateY(0deg)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "card-tilt": {
          "0%": {
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
          },
          "25%": {
            transform: "perspective(1000px) rotateX(2deg) rotateY(2deg)",
          },
          "75%": {
            transform: "perspective(1000px) rotateX(-2deg) rotateY(-2deg)",
          },
          "100%": {
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
          },
        },
        "foil-shine": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "holographic-shine": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "divine-pulse": {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 30px hsl(var(--primary) / 0.8)) drop-shadow(0 0 60px hsl(var(--accent) / 0.6)) drop-shadow(0 0 90px hsl(var(--secondary) / 0.4))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 50px hsl(var(--primary) / 1)) drop-shadow(0 0 100px hsl(var(--accent) / 0.8)) drop-shadow(0 0 150px hsl(var(--secondary) / 0.6))",
          },
        },
        "foil-rainbow": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        "card-hover": {
          "0%": {
            transform: "translateY(0px) scale(1)",
          },
          "100%": {
            transform: "translateY(-8px) scale(1.02)",
          },
        },
        "card-reveal": {
          "0%": {
            transform: "scale(0.8) rotateY(-180deg) translateY(20px)",
            opacity: "0"
          },
          "60%": {
            transform: "scale(1.05) rotateY(0deg) translateY(-10px)",
            opacity: "1"
          },
          "100%": {
            transform: "scale(1) rotateY(0deg) translateY(0px)",
            opacity: "1"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "card-flip": "card-flip 0.6s ease-in-out",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        "card-tilt": "card-tilt 4s ease-in-out infinite",
        "foil-shine": "foil-shine 4s ease-in-out infinite",
        "holographic-shine": "holographic-shine 3s ease-in-out infinite",
        "divine-pulse": "divine-pulse 3s ease-in-out infinite",
        "foil-rainbow": "foil-rainbow 3s ease-in-out infinite",
        "card-hover": "card-hover 0.3s ease-out",
        "card-reveal": "card-reveal 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
