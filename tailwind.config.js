/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#006638',
          primaryHover: '#007D45',
          primaryActive: '#004D2A',
          primaryLight: '#E6F4EC',
          success: '#52C41A',
          warning: '#FAAD14',
          error: '#FF4D4F',
          sidebarBg: '#001529',
          sidebarHover: '#006638',
          border: '#D9D9D9',
          tableHeader: '#FAFAFA',
          tableRowHover: '#F2F9F5',
        }
      }
    },
  },
  plugins: [],
}
