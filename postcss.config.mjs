/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    ...(process.env.NODE_ENV === "production"
      ? {
          "@fullhuman/postcss-purgecss": {
            content: [
              "./pages/**/*.{ts,tsx}",
              "./components/**/*.{ts,tsx}",
              "./app/**/*.{ts,tsx}",
              "./src/**/*.{ts,tsx}",
            ],
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          },
        }
      : {}),
  },
};

export default config;
