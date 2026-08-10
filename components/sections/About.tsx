import { getCompany } from "@/lib/api/content";
import { about } from "@/lib/content/site";
import AboutReveal from "./AboutReveal";

export default async function About() {
  let intro = about.fallbackIntro;

  try {
    const company = await getCompany();
    intro = company.vision ?? intro;
  } catch {
    // keep the static fallback
  }

  return <AboutReveal intro={intro} />;
}
