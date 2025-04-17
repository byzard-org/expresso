/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.ejs",
    "./public/**/*.js",
    "./generated/global.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "base-100": "var(--base-100)",
        "base-100-content": "var(--base-100-content)",
        "base-200": "var(--base-200)",
        "base-200-content": "var(--base-200-content)",
        "base-300": "var(--base-300)",
        "base-300-content": "var(--base-300-content)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        error: "var(--error)",
        success: "var(--success)",
        input: "var(--input)",
        ring: "var(--ring)",
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
      },

      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      keyframes: {
        error: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        error: "error 0.2s linear forwards",
      },
      screens: {
        mobile: {
          max: "767px",
        },
      },
    },
  },
  plugins: [],
};
