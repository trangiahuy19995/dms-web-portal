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
          primary: '#1890FF',
          primaryHover: '#40A9FF',
          primaryActive: '#096DD9',
          success: '#52C41A',
          warning: '#FAAD14',
          error: '#FF4D4F',
          sidebarBg: '#001529',
          sidebarHover: '#1890FF',
          border: '#D9D9D9',
          tableHeader: '#FAFAFA',
          tableRowHover: '#E6F7FF',
        }
      }
    },
  },
  plugins: [],
}
