/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { CvViewer } from "./components/CvViewer";
import futurPdf from "./assets/futur/PROJET DE FILM DOCUMENTAIRE.pdf?url";
import { Hero } from "./components/Hero";
import { ProjectSection } from "./components/ProjectSection";
import { PhotographySection } from "./components/PhotographySection";
import { Footer } from "./components/Footer";
import { TRANSLATIONS, PROJECTS, PHOTOGRAPHY_ALBUMS } from "./data/portfolio";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<'FR' | 'ENG'>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
      if (stored === 'FR' || stored === 'ENG') return stored;
      const navLang = typeof navigator !== 'undefined' ? (navigator.language || (navigator.languages?.[0] ?? '')).toLowerCase() : '';
      if (navLang.startsWith('fr')) return 'FR';
      return 'ENG';
    } catch {
      return 'FR';
    }
  });
  const [activeSection, setActiveSection] = useState('hero');
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [showCv, setShowCv] = useState(false);
  const [showFutur, setShowFutur] = useState(false);
  const containerRef = useRef(null);
  const touchStartX = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const t = TRANSLATIONS[lang];

  const openLightbox = (images: string[], index: number) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox(l => l ? { ...l, index: (l.index - 1 + l.images.length) % l.images.length } : null);
  const nextImage = () => setLightbox(l => l ? { ...l, index: (l.index + 1) % l.images.length } : null);

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'FR' ? 'fr' : 'en';
    }
  }, [lang]);

  useEffect(() => {
    const sections = ['hero', 'films', 'documentaries', 'experiences', 'photography', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightbox) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightbox]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCv(false);
    };
    if (showCv) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showCv]);

  const backgroundY = useTransform(scrollYProgress, [0, 0.2], ["0%", "15%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen font-mono overflow-x-hidden bg-bg">

      <Navbar
        activeSection={activeSection}
        lang={lang}
        setLang={setLang}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        translations={t}
        onCvOpen={() => setShowCv(true)}
        onFuturOpen={() => setShowFutur(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <Hero backgroundY={backgroundY} t={t} />

        <ProjectSection
          id="films"
          title={t.films}
          projects={PROJECTS.filter(p => p.category === 'film')}
          t={t}
          lang={lang}
          onImageClick={openLightbox}
        />

        <ProjectSection
          id="documentaries"
          title={t.documentaries}
          projects={PROJECTS.filter(p => p.category === 'documentary')}
          t={t}
          lang={lang}
          onImageClick={openLightbox}
        />

        <ProjectSection
          id="experiences"
          title={t.experiencesTitle}
          projects={PROJECTS.filter(p => p.category === 'experience')}
          t={t}
          lang={lang}
          onImageClick={openLightbox}
        />

        <PhotographySection
          albums={PHOTOGRAPHY_ALBUMS}
          t={t}
          lang={lang}
          onImageClick={openLightbox}
        />

        <Footer t={t} onCvOpen={() => setShowCv(true)} onImageClick={openLightbox} />
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-bg-95 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
            touchStartX.current = null;
          }}
        >
          {/* Prev */}
          {lightbox.images.length > 1 && (
            <button
              className="absolute left-2 md:left-6 z-10 p-2 text-title hover:text-accent transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={36} />
            </button>
          )}

          <motion.div
            key={lightbox.index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative px-12 md:px-20 max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              alt="Enlarged view"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Next */}
          {lightbox.images.length > 1 && (
            <button
              className="absolute right-2 md:right-6 z-10 p-2 text-title hover:text-accent transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Close */}
          <button
            className="absolute top-4 right-4 text-title hover:text-accent transition-colors cursor-pointer"
            onClick={closeLightbox}
          >
            <X size={28} />
          </button>

          {/* Counter */}
          {lightbox.images.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest opacity-40">
              {lightbox.index + 1} / {lightbox.images.length}
            </p>
          )}
        </motion.div>
      )}

      {/* CV Viewer Modal */}
      {showCv && <CvViewer lang={lang} onClose={() => setShowCv(false)} />}

      {/* Futur Projects Modal */}
      {showFutur && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-bg-95 flex flex-col"
          onClick={() => setShowFutur(false)}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-title-20 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-title opacity-60">{t.futurProjects}</p>
            <button
              onClick={() => setShowFutur(false)}
              className="text-title opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <iframe src={futurPdf} title={t.futurProjects} className="w-full h-full border-0" />
          </div>
        </motion.div>
      )}

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
