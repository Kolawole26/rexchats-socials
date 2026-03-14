/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],

  theme: {
    extend: {
      colors: {

        /* =========================
           NEUTRAL
        ========================= */

        neutral: {
          background: "var(--neutral-background)",
          surface: "var(--neutral-surface)",
          muted: "var(--neutral-muted)",
          line: "var(--neutral-line)",

          primary: "var(--neutral-primary)",
          secondary: "var(--neutral-secondary)",
          tertiary: "var(--neutral-tertiary)",
          inverted: "var(--neutral-inverted)",
        },



        /* =========================
           PRIMARY
        ========================= */

        primary: {
          50: "var(--primary-50)",
          75: "var(--primary-75)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
        },



        /* =========================
           SUCCESS
        ========================= */

        success: {
          50: "var(--success-50)",
          75: "var(--success-75)",
          100: "var(--success-100)",
          200: "var(--success-200)",
          300: "var(--success-300)",
          400: "var(--success-400)",
          500: "var(--success-500)",
        },



        /* =========================
           DANGER
        ========================= */

        danger: {
          50: "var(--danger-50)",
          75: "var(--danger-75)",
          100: "var(--danger-100)",
          200: "var(--danger-200)",
          300: "var(--danger-300)",
          400: "var(--danger-400)",
          500: "var(--danger-500)",
        },



        /* =========================
           WARNING
        ========================= */

        warning: {
          50: "var(--warning-50)",
          75: "var(--warning-75)",
          100: "var(--warning-100)",
          200: "var(--warning-200)",
          300: "var(--warning-300)",
          400: "var(--warning-400)",
          500: "var(--warning-500)",
        },



        /* =========================
           INFO
        ========================= */

        info: {
          50: "var(--info-50)",
          75: "var(--info-75)",
          100: "var(--info-100)",
          200: "var(--info-200)",
          300: "var(--info-300)",
          400: "var(--info-400)",
          500: "var(--info-500)",
        },



        /* =========================
           BRAND / ACCENT
        ========================= */

        brand: {
          indigo: {
            background: "var(--brand-indigo-background)",
            foreground: "var(--brand-indigo-foreground)",
          },

          blue: {
            background: "var(--brand-blue-background)",
            foreground: "var(--brand-blue-foreground)",
          },

          purple: {
            background: "var(--brand-purple-background)",
            foreground: "var(--brand-purple-foreground)",
          },

          pink: {
            background: "var(--brand-pink-background)",
            foreground: "var(--brand-pink-foreground)",
          },

          red: {
            background: "var(--brand-red-background)",
            foreground: "var(--brand-red-foreground)",
          },

          moss: {
            background: "var(--brand-moss-background)",
            foreground: "var(--brand-moss-foreground)",
          },

          monostone: {
            background: "var(--brand-monostone-background)",
            foreground: "var(--brand-monostone-foreground)",
          },

          magenta: {
            background: "var(--brand-magenta-background)",
            foreground: "var(--brand-magenta-foreground)",
          },
        },
      },



      fontFamily: {
        plusJakartaSans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },

  plugins: [],
};