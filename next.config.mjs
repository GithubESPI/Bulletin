/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    const urlString = process.env.NEXTAUTH_URL;
    if (urlString && urlString.trim()) {
      new URL(urlString);
    } else {
      console.error("Invalid NEXTAUTH_URL: ", urlString);
      throw new Error("Invalid NEXTAUTH_URL provided");
    }

    return [
      {
        source: "/old-path",
        destination: "/new-path",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https", // Spécifiez le protocole (http ou https)
        hostname: "assets.dewatermark.ai", // Le nom de domaine des images externes
      },
    ],
  },
};

export default nextConfig;
