import { CircuitBoard } from "@/components/layout/CircuitBoard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SplashScreen } from "@/components/layout/SplashScreen";
import About from "@/components/sections/About";
import BusinessLines from "@/components/sections/BusinessLines";
import Clients from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Products from "@/components/sections/Products";
import Projects from "@/components/sections/Projects";
import Team from "@/components/sections/Team";
import TechStack from "@/components/sections/TechStack";
import Testimonials from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <div id="top">
      <SplashScreen />
      <CircuitBoard />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <TechStack />
        <BusinessLines />
        <Clients />
        <Testimonials />
        <Team />
        <Products />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
