module.exports = {
  mode: "jit",

  content: ["./src/**/*.{html,js,svelte}"],

  plugins: [require("@tailwindcss/line-clamp")],
  theme: {
    extend: {
      transformOrigin: {
        0: "0%",
      },
      zIndex: {
        "-1": "-1",
      },
      borderRadius: {
        sm: "1px",
        md: "2px",
        lg: "4px",
      },
      fontFamily: {
        CorpoA: ["CorpoA Regular"],
        "CorpoA-Bold": ['"CorpoA Bold"'],
        "CorpoA-Italic": ['"CorpoA Italic"'],
        "CorpoA-BoldItalic": ['"CorpoA Bold Italic"'],

        CorpoS: ["CorpoS Regular"],
        "CorpoS-Bold": ['"CorpoS Bold"'],
        "CorpoS-Italic": ['"CorpoS Italic"'],
        "CorpoS-BoldItalic": ['"CorpoS Bold Italic"'],
      },
      colors: {
        primary: {
          DEFAULT: "#176db7",
          50: "#e6edf5",
          100: "#b3c9e0",
          200: "#80a5cc",
          300: "#4d80b8",
          400: "#1a5ca3",
          500: "#004a99",
          600: "#00438a",
          700: "#00346b",
          800: "#00254d",
          900: "#00162e",
        },
        accent: {
          DEFAULT: "#fa7252",
          50: "#fff1ee",
          100: "#fed5cb",
          200: "#fdb9a9",
          300: "#fc9c86",
          400: "#fb8063",
          500: "#fa7252",
          600: "#e1674a",
          700: "#af5039",
          800: "#7d3929",
          900: "#4b2219",
        },
      },
    },
  },
};
