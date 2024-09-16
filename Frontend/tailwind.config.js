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
    themes: [{
      mytheme: {
        
"primary": "#00afff",
        
"secondary": "#0074ff",
        
"accent": "#1e40af",
        
"neutral": "#1e1500",
        
"base-100": "#f1ffff",
        
"info": "#0088ff",
        
"success": "#00b985",
        
"warning": "#e57c00",
        
"error": "#ff1e5b",
        },
      }, "luxury"],
    },
    plugins: [
    require('daisyui'),
  ],
}