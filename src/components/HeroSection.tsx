import type { Translations } from "../data/portfolio";
import filmingPhoto from "../assets/about/claireAbout.webp";
import portraitPhoto from "../assets/projects/photographies/portraits/nepal/DSC00198.webp";

// Home: 50/50 grid without visible text. White left half, B&W portrait on the right,
// the filming photo straddles the split (mostly on the white side).
export function HeroSection({ t }: { t: Translations }) {
  return (
    <section id="top" aria-labelledby="hero-t" className="hero relative grid w-full overflow-hidden bg-white">
      <h1 id="hero-t" className="sr-only">
        {t.heroTitle}
      </h1>
      <div aria-hidden="true" className="bg-white" />
      <div className="relative min-w-0 overflow-hidden">
        <img
          src={portraitPhoto}
          alt={t.heroAltPortrait}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[50%_0%] grayscale"
        />
      </div>
      <figure className="hero-card absolute m-0 z-[1]">
        <figcaption className="inline-block m-0 pr-2 pb-1 bg-white text-[13px] font-bold tracking-[0.01em] uppercase leading-[1.2] text-ink">
          {t.heroCaption}
        </figcaption>
        <img
          src={filmingPhoto}
          alt={t.heroAltFilming}
          fetchPriority="high"
          className="block w-full aspect-[254/151] object-cover grayscale"
        />
      </figure>
    </section>
  );
}
