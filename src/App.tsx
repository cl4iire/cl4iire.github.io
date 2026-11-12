import { useCallback, useEffect, useState } from "react";
import { TRANSLATIONS, PROJECTS, PHOTOGRAPHY_ALBUMS, type Lang } from "./data/portfolio";
import { Sidebar, type SectionId } from "./components/Sidebar";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { WorksSection, type WorkCategory } from "./components/WorksSection";
import { PhotographySection } from "./components/PhotographySection";
import { ContactSection } from "./components/ContactSection";
import { Lightbox, type Gallery, type GalleryItem } from "./components/Lightbox";
import { DocumentModal, type DocumentKind } from "./components/DocumentModal";

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "FR" || stored === "ENG") return stored;
    return (navigator.language || "").toLowerCase().startsWith("fr") ? "FR" : "ENG";
  } catch {
    return "FR";
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [category, setCategory] = useState<WorkCategory>("all");
  const [activeSection, setActiveSection] = useState<SectionId>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [doc, setDoc] = useState<DocumentKind | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    document.documentElement.lang = lang === "FR" ? "fr" : "en";
  }, [lang]);

  // Active nav entry: last section whose top passed 35% of the viewport
  useEffect(() => {
    const onScroll = () => {
      let current: SectionId = "top";
      (["travaux", "photographies", "contact"] as const).forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) current = id;
      });
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // No page scroll behind full-screen windows
  const overlayOpen = menuOpen || !!gallery || !!doc;
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
  }, [overlayOpen]);

  const openGallery = useCallback((title: string, items: GalleryItem[], index: number) => setGallery({ title, items, index }), []);
  const closeDoc = useCallback(() => setDoc(null), []);
  const openCv = () => setDoc("cv");
  const openProject = () => setDoc("project");

  return (
    <div className="min-h-screen bg-rose text-ink">
      <a
        href="#travaux"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-3 focus:rounded-full focus:bg-ink focus:text-rose"
      >
        {t.works}
      </a>
      <div className="desk:flex desk:items-start">
        <Sidebar
          t={t}
          lang={lang}
          setLang={setLang}
          activeSection={activeSection}
          category={category}
          onNavigate={(cat) => cat && setCategory(cat)}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          onOpenCv={openCv}
          onOpenProject={openProject}
        />
        <main className="flex-[1_1_auto] min-w-0">
          <HeroSection t={t} />
          <AboutSection t={t} />
          <WorksSection
            t={t}
            lang={lang}
            projects={PROJECTS}
            category={category}
            setCategory={setCategory}
            onOpenGallery={openGallery}
          />
          <PhotographySection t={t} lang={lang} albums={PHOTOGRAPHY_ALBUMS} onOpenGallery={openGallery} />
          <ContactSection t={t} onOpenCv={openCv} onOpenProject={openProject} />
        </main>
      </div>

      {gallery && (
        <Lightbox t={t} gallery={gallery} setIndex={(index) => setGallery({ ...gallery, index })} onClose={() => setGallery(null)} />
      )}
      {doc && <DocumentModal t={t} lang={lang} kind={doc} onClose={closeDoc} />}
    </div>
  );
}
