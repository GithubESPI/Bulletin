"use client";

import Reviews from "@/components/Reviews";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();

  console.log(session);

  return (
    <div className="overflow-hidden">
      <div className="relative">
        <div className="w-full lg:h-full absolute bg-opacity-0 backdrop-blur-3xl"></div>
        <div className="container pt-[90px] lg:relative lg:min-h-[700px] lg:pt-[160px] lg:pb-10 lg:flex lg:flex-col lg:justify-center lg:items-center">
          <div className="relative w-full flex justify-center">
            <h1 className="text-neutral-ink-900 mb-8 text-center lg:text-center H30B tlg:H56B !leading-normal">
              Générer vos bulletins scolaires <br /> automatiques
            </h1>
          </div>
          <div className="text-neutral-600 relative text-center tlg:text-left T16R tlg:T20R">
            Simplifiez la gestion et la distribution des bulletins scolaires semestriels et annuels,
            des apprenants, <br /> avec notre application innovante intégrée à Yparéo.
          </div>
          <div className="order-2 mt-9 lg:order-1 relative">
            <div className="rounded-xl lg:px-16 px-6 text-center">
              <div className="relative text-center lg:w-[360px] max-w-md mx-auto">
                <Button className="inline-flex items-center justify-center w-full bg-wtm-button-linear rounded-lg hover:bg-opacity-80 transition cursor-pointer shadow-wtm-button-shadow px-10 py-5 hover:bg-wtm-button-linear-reverse hover:shadow-wtm-button-shadow">
                  <ArrowDown className="inline-flex mr-2" size={20} />
                  <Link
                    href="/configure/upload"
                    className="font-semibold leading-[28px] tracking-[0.02em]"
                  >
                    Générer vos bulletins
                  </Link>
                </Button>
              </div>
              <Reviews />
            </div>
          </div>
        </div>
      </div>

      <section className="lg:pt-24 lg:pb-[120px] py-12" id="utilisation">
        <div className="container">
          <div className="lg:max-w-[60%] mx-auto">
            <h2 className="text-center lg:text-4xl text-2xl font-bold leading-10">
              Comment <span className="inline-block leading-normal text-primary-50"> générer</span>{" "}
              des bulletins pour les apprenants ?
            </h2>
          </div>
          <div className="space-y-12 pt-10 lg:pt-[72px] lg:space-y-20">
            <div className="sm:flex sm:justify-start sm:items-center gap-10 justify-center items-center text-base-content-primary">
              <div className="flex flex-col gap-5 w-full tlg:w-1/2">
                <div className="w-14 h-14 bg-violet-100 rounded-xl flex flex-col justify-center items-center">
                  <Upload />
                </div>
                <div>
                  <h3 className="text-neutral-900 text-xl lg:text-3xl font-bold leading-relaxed lg:leading-10">
                    <span className="text-primary-50">Téléchargement </span>des Fichiers Excel et
                    Word
                  </h3>
                  <p className="sm:mb-8 sm:mt-4 sm:text-sm text-justify">
                    Téléchargez vos fichiers Excel et Word contenant les données nécessaires <br />{" "}
                    (notes, informations sur les apprenants, appréciations) provenant d&apos;Yparéo.{" "}
                    <br /> Ces fichiers serviront de base pour la génération des bulletins.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center w-full tlg:w-1/2">
                <div className="max-w-[921px] m-auto bg-white lg:p-6 p-3 rounded-2xl shadow-wtm-image-compare-shadow sm:mt-10">
                  <div className="h-auto w-full">
                    <div className="flex justify-center items-center">
                      <div className="w-full">
                        <div className="relative cursor-pointer">
                          <video
                            autoPlay
                            controls
                            width="320"
                            height="240"
                            src="/videos/video-1.mp4"
                            className="relative w-full rounded-2xl slider-feature-split-line rendered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:flex sm:justify-start sm:items-center gap-10 justify-center items-center text-base-content-primary flex-row-reverse">
              <div className="flex flex-col gap-5 w-full tlg:w-1/2">
                <div className="w-14 h-14 bg-cyan-50 rounded-xl flex flex-col justify-center items-center">
                  <Sparkles />
                </div>
                <div>
                  <h3 className="text-neutral-900 text-xl lg:text-3xl font-bold leading-relaxed lg:leading-10">
                    <span className="text-primary-50">Lancer </span>la Génération des Bulletins
                  </h3>
                  <p className="sm:mb-8 sm:mt-4 sm:text-sm text-justify">
                    Cliquez sur le bouton{" "}
                    <span className="text-primary-50">Générer vos bulletins </span> pour lancer le
                    processus. Déposer votre document Word et Excel, puis le système va
                    automatiquement traiter les fichiers Excel et Word pour créer des bulletins de
                    notes au format PDF.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center w-full tlg:w-1/2">
                <div className="max-w-[921px] m-auto bg-white lg:p-6 p-3 rounded-2xl shadow-wtm-image-compare-shadow sm:mt-10">
                  <div className="h-auto w-full">
                    <div className="flex justify-center items-center">
                      <div className="w-full">
                        <div className="relative cursor-pointer">
                          <video
                            autoPlay
                            controls
                            width="320"
                            height="240"
                            src="/videos/video-2.mp4"
                            className="relative w-full rounded-2xl slider-feature-split-line rendered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:flex sm:justify-start sm:items-center gap-10 justify-center items-center text-base-content-primary">
              <div className="flex flex-col gap-5 w-full tlg:w-1/2">
                <div className="w-14 h-14 bg-violet-100 rounded-xl flex flex-col justify-center items-center">
                  <Upload />
                </div>
                <div>
                  <h3 className="text-neutral-900 text-xl lg:text-3xl font-bold leading-relaxed lg:leading-10">
                    <span className="text-primary-50">Téléchargement </span>des Bulletins Générés
                  </h3>
                  <p className="sm:mb-8 sm:mt-4 sm:text-sm text-justify">
                    Une fois la génération terminée, téléchargez tous les bulletins sous forme de
                    fichier ZIP.
                    <br /> Cela vous permet de récupérer l&apos;ensemble des bulletins en un seul
                    fichier compressé.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center w-full tlg:w-1/2">
                <div className="max-w-[921px] m-auto bg-white lg:p-6 p-3 rounded-2xl shadow-wtm-image-compare-shadow sm:mt-10">
                  <div className="h-auto w-full">
                    <div className="flex justify-center items-center">
                      <div className="w-full">
                        <div className="relative cursor-pointer">
                          <img
                            src="https://assets.dewatermark.ai/images/watermark-remover/new/featureComparison/before_2.webp"
                            alt="video1"
                            className="relative w-full rounded-2xl slider-feature-split-line rendered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:flex sm:justify-start sm:items-center gap-10 justify-center items-center text-base-content-primary flex-row-reverse">
              <div className="flex flex-col gap-5 w-full tlg:w-1/2">
                <div className="w-14 h-14 bg-cyan-50 rounded-xl flex flex-col justify-center items-center">
                  <Sparkles />
                </div>
                <div>
                  <h3 className="text-neutral-900 text-xl lg:text-3xl font-bold leading-relaxed lg:leading-10">
                    <span className="text-primary-50">Importation </span>des Bulletins dans Yparéo
                  </h3>
                  <p className="sm:mb-8 sm:mt-4 sm:text-sm text-justify">
                    Cliquez sur le bouton{" "}
                    <span className="text-primary-50">Envoyer sur Yparéo </span> pour importer les
                    bulletins générés directement dans le système Yparéo. Le système associe chaque
                    bulletin à l&apos;apprenant concerné grâce à un identifiant unique.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center w-full tlg:w-1/2">
                <div className="max-w-[921px] m-auto bg-white lg:p-6 p-3 rounded-2xl shadow-wtm-image-compare-shadow sm:mt-10">
                  <div className="h-auto w-full">
                    <div className="flex justify-center items-center">
                      <div className="w-full">
                        <div className="relative cursor-pointer">
                          <img
                            src="https://assets.dewatermark.ai/images/watermark-remover/new/featureComparison/before_2.webp"
                            alt="video2"
                            className="relative w-full rounded-2xl slider-feature-split-line rendered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 tlg:py-[120px] bg-gradient-to-r from-third-50 to-primary-50 snap-block"
        id="faq"
      >
        <div className="container flex lg:flex-row flex-col lg:gap-[112px]">
          <div className="mb-6 lg:mb-12 tlg:w-1/2">
            <h2 className="text-white text-2xl lg:text-4xl font-bold lg:leading-[46px]">
              Questions fréquemment
              <br /> posées
            </h2>
            <p className="text-white text-sm tlg:text-xl font-medium tlg:leading-7 leading-tight mt-6">
              Si vous êtes bloqué quelque part, nous sommes là pour vous aider !
            </p>
          </div>
          <div className="divide-y tlg:w-1/2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Quels types de fichiers dois-je utiliser pour générer les bulletins ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Vous devez fournir un fichier Excel contenant les données des apprenants (notes,
                  absences, etc.) et un fichier Word, contenant les appréciations des étudiants. Ces
                  fichiers seront utilisés pour générer les bulletins PDF.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Comment générer les bulletins de notes ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Une fois connecté, cliquez sur le bouton Générer vos bulletins. Vous accéderer à
                  une page ou vous pourriez déposer votre document excel et word. Le processus de
                  génération commencera automatiquement à partir des fichiers fournis.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Comment suivre la progression de la génération des bulletins ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Pendant la génération des bulletins, une barre de progression sera affichée à
                  l&apos;écran. Vous pourrez ainsi suivre en temps réel l&apos;avancement du
                  processus.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Où puis-je récupérer les bulletins après leur génération ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Une fois la génération terminée, vous aurez la possibilité de télécharger tous les
                  bulletins sous forme de fichier ZIP en cliquant sur le lien de téléchargement qui
                  apparaîtra à l&apos;écran.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Comment importer les bulletins dans Yparéo ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Après avoir généré et téléchargé les bulletins, cliquez sur Envoyer sur Yparéo
                  pour que les bulletins soient automatiquement importés dans le système Yparéo et
                  associés aux apprenants concernés.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Que faire en cas d&apos;erreurs lors de la génération ou de l&apos;importation ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Si une erreur se produit, un message d&apos;erreur apparaîtra avec des détails.
                  Pour résoudre le problème, contactez le support technique.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Puis-je réimporter les bulletins après avoir corrigé des erreurs ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Oui, vous pouvez réimporter les bulletins à tout moment en suivant à nouveau le
                  processus d&apos;importation. L&apos;application permettra d&apos;écraser les
                  documents précédemment importés si nécessaire.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger className="flex items-center justify-between w-full px-5 py-4 text-white no-underline">
                  <h3 className="block pr-4 font-semibold text-left text-neutral-ink-600">
                    {" "}
                    Comment savoir si l&apos;importation a réussi ?
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex items-center justify-between w-full px-5 py-4 text-white">
                  Après l&apos;importation, un message de confirmation s&apos;affichera si tout
                  s&apos;est bien passé. Vous pouvez également vérifier dans Yparéo que les
                  bulletins sont bien associés aux apprenants concernés.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
