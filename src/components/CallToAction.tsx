import { ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "./ui/button";

const DynamicReviews = dynamic(() => import("@/components/Reviews"), {
  ssr: false,
});

const CallToAction = () => {
  return (
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
        <DynamicReviews />
      </div>
    </div>
  );
};

export default CallToAction;
