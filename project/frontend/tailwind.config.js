/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1.5', transform: 'translateY(0px)' },
        },
        
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-in',
        

        

      },
    },
  },
  plugins: [],
}
