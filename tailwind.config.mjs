/** @type {import('tailwindcss').Config} */
export default {
  // hover: utilities apply only on devices that can really hover, so taps on phones and
  // tablets don't leave links and buttons stuck in their hover state.
  future: { hoverOnlyWhenSupported: true },
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: { extend: {
    colors: { wine:'#701D2E', 'wine-dark':'#46121D', gold:'#C5A253', sand:'#E8DCC7', cream:'#F8F3E9' },
    fontFamily: { sans:['Inter','ui-sans-serif','system-ui','sans-serif'], display:['Georgia','ui-serif','serif'] }
  }},
  plugins: []
};