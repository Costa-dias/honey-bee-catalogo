/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'verde-musgo': '#2f3e2e',
        'verde-musgo-dark': '#212d20',
        'verde-musgo-light': '#3d523b',
        'amarelo-mel': '#f3c13a',
        'amarelo-mel-dark': '#d9a82e',
        'amarelo-mel-light': '#f8d96b',
        'bege-suave': '#f7f4ed',
        'bege-claro': '#faf8f2',
        'preto': '#1a1a1a',
        'whatsapp': '#25d366',
        'whatsapp-dark': '#1da851',
        'instagram': '#c13584',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Poppins', 'sans-serif'],
      },
      animation: {
        'surgir': 'surgir 0.3s ease',
        'fade-in': 'fadeIn 0.4s ease',
        'slide-up': 'slideUp 0.4s ease',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        surgir: {
          'from': { transform: 'scale(0.8)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

