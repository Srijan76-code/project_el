import Image from "next/image";
import Hero from "./_components/Hero";
import About from "./_components/About";
import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <About/>
    </div>
  );
}