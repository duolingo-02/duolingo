/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the files Tailwind should scan for class usage
  content: ["./src/**/*.{html,js,ts,tsx}"],

  theme: {
    extend: {
      // ==============================
      // Custom Font Family
      // ==============================
      fontFamily: {
        sans: ["Alata", "sans-serif"],
        heading: ["Poppins", "sans-serif"], // Additional font for headings
      },

      // ==============================
      // Custom Color Palette
      // ==============================
      colors: {
        duolingoGreen: "#58CC02",
        duolingoGreenLight: "#7FE82B", // Lighter green variant
        duolingoGreenDark: "#3A9501", // Darker green variant

        duolingoBlue: "#1CB0F6",
        duolingoBlueLight: "#51CCFF", // Lighter blue variant
        duolingoBlueDark: "#0A85C4", // Darker blue variant

        duolingoDark: "#101827",
        duolingoDark2: "#1b242f", // Slightly darker shade
        duolingoDark3: "#2C3B49", // Softer dark gray variant

        duolingoLight: "#FFFFFF", // Pure white
        duolingoLightGray: "#F3F4F6", // Light gray for backgrounds

        duolingoGray: "#A0A0A0",
        duolingoGrayLight: "#C0C0C0", // Lighter gray for borders
        duolingoGrayDark: "#707070", // Darker gray variant

        duolingoYellow: "#FFD700",
        duolingoYellowLight: "#FFE66D", // Lighter yellow variant
        duolingoYellowDark: "#CCAC00", // Darker yellow variant

        duolingoDarkLight: "#3B3B3B",
        duolingoDarkLight2: "#4A4A4A", // Slightly lighter dark gray
      },

      // ==============================
      // Custom Border Radius
      // ==============================
      borderRadius: {
        xl: "1.5rem", // Extra-large rounded corners
        "2xl": "2rem", // Even larger rounded corners
        "3xl": "3rem", // Largest rounded corners
        full: "9999px", // Fully rounded (pill-shaped)
      },

      // ==============================
      // Custom Spacing (Padding, Margin)
      // ==============================
      spacing: {
        18: "4.5rem", // Custom small spacing
        128: "32rem", // Custom large spacing
        144: "36rem", // Extra-large spacing for large components
      },

      // ==============================
      // Custom Box Shadows
      // ==============================
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)", // Soft shadow for cards
        deep: "0 10px 15px rgba(0, 0, 0, 0.3)", // Deep shadow for larger elements
      },

      // ==============================
      // Custom Screen Breakpoints
      // ==============================
      screens: {
        xs: "480px", // For extra small devices
        "2xl": "1536px", // For extra-large screens
      },
    },
  },

  // ==============================
  // Custom Variants and Plugins
  // ==============================
  variants: {
    extend: {
      backgroundColor: ["active", "disabled"], // Adds active and disabled states for background color
      opacity: ["disabled"], // Controls opacity for disabled elements
    },
  },

  plugins: [
    require("@tailwindcss/forms"), // Better form styling plugin
    require("@tailwindcss/typography"), // Enhanced typography for text-heavy pages
    require("@tailwindcss/aspect-ratio"), // Aspect-ratio utilities for image or video containers
  ],
};
