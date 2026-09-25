// Registers the ScrollTrigger plugin once, at app startup.
// Any page can then use ScrollTrigger without importing/registering it again.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
