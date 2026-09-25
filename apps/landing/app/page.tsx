import Header from "@/components/global/Header";
import Shell from "@/components/global/Shell";
import LoadingScreen from "@/components/global/LoadingScreen";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
// import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Results from "@/components/sections/Results";
import WhyChoose from "@/components/sections/WhyChoose";
import Security from "@/components/sections/Security";
import Articles from "@/components/sections/Articles";
import FAQ from "@/components/sections/FAQ";
import Quote from "@/components/sections/Quote";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Header />
      <Shell>
        <Hero />
        <Marquee />
        {/* <Services /> */}
        <Work />
        <Results />
        <WhyChoose />
        <Security />
        <Articles />
        <FAQ />
        <Quote />
        <Footer />
      </Shell>
    </>
  );
}
