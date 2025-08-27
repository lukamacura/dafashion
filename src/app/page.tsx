import Hero from "@/components/sections/hero";
import NewCollection from "@/components/sections/new-collection";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";


export default function Page() {
  return (
    <div className="bg-black">
      <Hero />      
      <NewCollection />
      <Testimonials />
      <FAQ />

    </div>
  );
}
