import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si";
import { Button } from "./ui/button";

const ButtonsProvider = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true); // Démarre le loader
    try {
      await signIn("github"); // Appelez votre fournisseur d'authentification ici
    } catch (error) {
      setLoading(false); // Si une erreur se produit, arrêtez le loader
    }
  };
  /* <Button onClick={() => signIn("azure-ad")} className="bg-primary-50 p-6">Se connecter avec Azure</Button> */

  return (
    <>
      <div className="flex flex-col space-y-4">
        <Button
          onClick={handleSignIn}
          className="w-full bg-primary-50 p-6 flex items-center justify-center"
          disabled={loading} // Désactiver le bouton pendant le chargement
        >
          {loading ? (
            <FaSpinner className="h-4 w-4 mr-2 animate-spin" /> // Icône de spinner pour le chargement
          ) : (
            <SiMicrosoftazure className="h-4 w-4 mr-2" />
          )}
          <p className="text-white">Se connecter avec mon compte ESPI</p>
        </Button>
        {/* <Button onClick={() => signIn("azure-ad")} className="bg-primary-50 p-6">
          Se connecter avec mon compte ESPI
        </Button> */}
        {/* <Button onClick={() => signIn("github")} className="bg-primary-50 p-6">
        Se connecter avec mon compte ESPI
      </Button> */}
      </div>
    </>
  );
};

export default ButtonsProvider;
