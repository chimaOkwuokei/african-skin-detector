import Collaborators from "@/components/landing/collaborators";
import CTA from "@/components/landing/cta";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1  font-sans dark:bg-black">
      <Header/>
      <Hero/>
      <Features/>
      <CTA/>
      {/* <Collaborators/> */}
      <Footer/> 
    </div>
  );
}
