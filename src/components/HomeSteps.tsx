import { Sparkles, Upload } from "lucide-react";
import React from "react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonColor: string;
}

const HomeSteps: React.FC = () => {
  const steps: Step[] = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Téléchargement des Fichiers Excel et Word",
      description:
        "Téléchargez vos fichiers Excel et Word contenant les données nécessaires (notes, informations sur les apprenants, appréciations) provenant d'Yparéo. Ces fichiers serviront de base pour la génération des bulletins.",
      imageUrl:
        "https://assets.dewatermark.ai/images/watermark-remover/new/featureComparison/before_2.webp",
      buttonText: "Essayez maintenant",
      buttonColor: "text-purple-600",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Lancer la Génération des Bulletins",
      description:
        "Cliquez sur le bouton 'Générer vos bulletins' pour lancer le processus. Déposer votre document Word et Excel, puis le système va automatiquement traiter les fichiers Excel et Word pour créer des bulletins de notes au format PDF.",
      imageUrl:
        "https://assets.dewatermark.ai/images/watermark-remover/new/featureComparison/before_2.webp",
      buttonText: "Essayez maintenant",
      buttonColor: "text-teal-600",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Téléchargement des Bulletins Générés",
      description:
        "Une fois la génération terminée, téléchargez tous les bulletins sous forme de fichier ZIP. Cela vous permet de récupérer l'ensemble des bulletins en un seul fichier compressé.",
      imageUrl:
        "https://assets.dewatermark.ai/images/watermark-remover/new/featureComparison/before_2.webp",
      buttonText: "Essayez maintenant",
      buttonColor: "text-teal-600",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Importation des Bulletins dans Yparéo",
      description:
        "Cliquez sur le bouton 'Envoyer sur Yparéo' pour importer les bulletins générés directement dans le système Yparéo. Le système associe chaque bulletin à l'apprenant concerné grâce à un identifiant unique.",
      imageUrl:
        "https://assets.dewatermark.ai/images/watermark-remover/new/featureComparison/before_2.webp",
      buttonText: "Essayez maintenant",
      buttonColor: "text-teal-600",
    },
  ];

  const highlightFirstWord = (title: string): React.ReactNode => {
    const words = title.split(" ");
    return (
      <>
        <span className="text-primary-50">{words[0]}</span> {words.slice(1).join(" ")}
      </>
    );
  };

  return (
    <div className="container">
      <div className="lg:max-w-[60%] mx-auto">
        <h2 className="text-center lg:text-4xl text-2xl font-bold leading-10">
          Comment <span className="inline-block leading-normal text-primary-50"> générer </span> des
          bulletins par apprenants ?
        </h2>
      </div>
      <div className="space-y-12 pt-10 lg:pt-[72px] lg:space-y-20">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`sm:flex sm:justify-start sm:items-center gap-10 justify-center items-center text-base-content-primary ${
              index % 2 !== 0 ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex flex-col gap-5 w-full lg:w-1/2">
              <div
                className={`w-14 h-14 ${
                  index === 0 ? "bg-violet-100" : "bg-cyan-50"
                } rounded-xl flex flex-col justify-center items-center`}
              >
                {step.icon}
              </div>
              <div>
                <h3 className="text-neutral-900 text-xl lg:text-3xl font-bold leading-relaxed lg:leading-10">
                  {highlightFirstWord(step.title)}
                </h3>
                <p className="sm:mb-10 sm:mt-4 sm:text-sm">{step.description}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center w-full lg:w-1/2">
              <div className="m-5 bg-white lg:p-6 p-3 rounded-2xl shadow-wtm-image-compare-shadow sm:mt-10">
                <div className="h-auto w-full">
                  <div className="flex justify-center items-center">
                    <div className="w-full">
                      <div className="relative cursor-pointer">
                        <img
                          src={step.imageUrl}
                          alt=""
                          className="max-h-[200px] lg:h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSteps;
