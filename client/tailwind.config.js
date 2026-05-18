export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a3870',
        accent: '#1a6ef5',
        glass: 'rgba(230, 242, 255, 0.75)',
      },
      backdropBlur: {
        glass: '10px',
      },
    },
  },
  plugins: [],
};
