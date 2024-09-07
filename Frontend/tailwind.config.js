/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: [
      {
        mythemeLight: {
          "primary": "#3b82f6",
          "secondary": "#1e3a8a",
          "accent": "#86198f",
          "neutral": "#3b82f6",
          "base-100": "#f5f5f4",
          "info": "#3b82f6",
          "success": "#00f872",
          "warning": "#fbbf24",
          "error": "#dc2626",
          },
        },
      {
        mythemeDard:{
          "primary": "#3b82f6",
          "secondary": "#1e3a8a",
          "accent": "#86198f",
          "neutral": "#3b82f6",
          "base-100": "#1f2937",
          "info": "#3b82f6",
          "success": "#00f872",
          "warning": "#fbbf24",
          "error": "#dc2626",
          }
        }
      ],
    },
    plugins: [
    require('daisyui'),
  ],
}