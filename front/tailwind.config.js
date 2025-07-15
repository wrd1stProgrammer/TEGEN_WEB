// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // sans를 기본으로 교체
        sans: [
          // English / Vietnamese
          "Inter",
          // Korean
          "Pretendard",
          // Japanese
          "Noto Sans JP",
          // Simplified Chinese
          "Noto Sans SC",
          // Traditional Chinese
          "Noto Sans TC",
          // fallback
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require('daisyui')],
}
