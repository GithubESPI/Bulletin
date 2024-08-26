import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const ButtonsProvider = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={() => signIn("azure-ad")} className="bg-primary-50 p-6">Se connecter avec mon compte ESPI</Button>
      {/* <Button onClick={() => signIn("github")} className="bg-primary-50 p-6">
        Se connecter avec mon compte ESPI
      </Button> */}
    </div>
  );
};

export default ButtonsProvider;
