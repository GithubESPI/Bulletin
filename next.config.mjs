const nextConfig = {
  async redirects() {
    const urlString = process.env.NEXTAUTH_URL || ""; // Valeur par défaut vide si NEXTAUTH_URL est manquante
    if (urlString.trim() === "") {
      console.error("Invalid NEXTAUTH_URL: ", urlString);
      return []; // Retourne une configuration vide pour éviter de bloquer le build
    }

    try {
      new URL(urlString);
      // Si l'URL est valide, continuer
      return [
        {
          source: "/old-path",
          destination: "/new-path",
          permanent: true,
        },
      ];
    } catch (error) {
      console.error("Error with NEXTAUTH_URL: ", error);
      return []; // Retourne une configuration vide pour éviter de bloquer le build
    }
  },
};

module.exports = nextConfig;
