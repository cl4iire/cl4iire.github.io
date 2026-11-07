import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  lang: 'FR' | 'ENG';
  setLang: (lang: 'FR' | 'ENG') => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  translations: any;
  onCvOpen: () => void;
  onFuturOpen: () => void;
}

export const Navbar = ({
  activeSection,
  lang,
  setLang,
  isMenuOpen,
  setIsMenuOpen,
  translations: t,
  onCvOpen,
  onFuturOpen
}: NavbarProps) => {
  const navItems = [
    { id: 'films', label: t.films },
    { id: 'documentaries', label: t.documentaries },
    { id: 'experiences', label: t.experiences },
    { id: 'photography', label: t.photography },
    { id: 'contact', label: t.contact }
  ];

  return (
    <>
      {/* Left Sidebar Navigation (Desktop) */}
      <nav className="fixed top-0 left-0 h-full w-64 z-40 p-12 hidden lg:flex flex-col justify-between mix-blend-difference text-title-40">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tighter text-title"
        >
          <a href="#hero" className="hover:text-title transition-colors cursor-pointer" aria-label="Go to top / hero">
            CLAIRE B.L
          </a>
        </motion.div>
        
        <div className="flex flex-col gap-6 text-xs uppercase tracking-[0.3em]">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`} 
              className={`transition-all duration-300 hover:text-title ${activeSection === item.id ? 'text-title font-bold translate-x-2' : ''}`}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={onFuturOpen}
            className="flex items-center gap-2 hover:text-title transition-colors mt-20 cursor-pointer text-left"
          >
            {t.futurProjects}
          </button>
          <button
            onClick={onCvOpen}
            className="flex items-center gap-2 hover:text-title transition-colors cursor-pointer text-left"
          >
            {t.cv}
          </button>
          {/* <a href="https://www.linkedin.com/in/claire-buhaceanu-laborde-51a74738b/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-title transition-colors">
            LINKEDIN
          </a> */}
        </div>

        <div 
          className="flex items-center gap-4 border border-title-20 rounded-full px-4 py-2 text-xs w-fit cursor-pointer select-none"
          onClick={() => setLang(lang === 'FR' ? 'ENG' : 'FR')}
          role="group"
          aria-label="Language selector"
          title="Switch language"
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setLang('FR'); }} 
            className={`${lang === 'FR' ? 'text-accent font-bold' : 'opacity-50'} hover:opacity-100 transition-opacity cursor-pointer`}
          >
            FR
          </button>
          <span className="opacity-20">|</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setLang('ENG'); }} 
            className={`${lang === 'ENG' ? 'text-accent font-bold' : 'opacity-50'} hover:opacity-100 transition-opacity cursor-pointer`}
          >
            ENG
          </button>
        </div>
      </nav>

      {/* Mobile Navigation (brand hidden until menu opens) */}
      <nav className="fixed top-0 left-0 w-full z-40 p-6 flex justify-end items-center lg:hidden mix-blend-difference text-title">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-bg z-30 flex flex-col items-center justify-center gap-8 text-title text-2xl uppercase font-display"
        >
          <a 
            href="#hero" 
            onClick={() => setIsMenuOpen(false)} 
            className="absolute top-8 left-1/2 -translate-x-1/2 text-xl font-bold tracking-tighter hover:text-title transition-colors cursor-pointer"
            aria-label="Go to top / hero"
          >
            CLAIRE B.L.
          </a>
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setIsMenuOpen(false)}>{item.label}</a>
          ))}
          <button
            onClick={() => { onFuturOpen(); setIsMenuOpen(false); }}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            {t.futurProjects}
          </button>
          <button
            onClick={() => { onCvOpen(); setIsMenuOpen(false); }}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            {t.cv}
          </button>
          <div
            className="flex items-center gap-4 mt-8 border border-title-20 rounded-full px-5 py-2 text-base cursor-pointer select-none"
            onClick={() => setLang(lang === 'FR' ? 'ENG' : 'FR')}
            role="group"
            aria-label="Language selector"
            title="Switch language"
          >
            <button onClick={(e) => { e.stopPropagation(); setLang('FR'); }} className={lang === 'FR' ? 'text-accent font-bold' : 'opacity-60 hover:opacity-100'}>FR</button>
            <span className="opacity-20">|</span>
            <button onClick={(e) => { e.stopPropagation(); setLang('ENG'); }} className={lang === 'ENG' ? 'text-accent font-bold' : 'opacity-60 hover:opacity-100'}>ENG</button>
          </div>
        </motion.div>
      )}
    </>
  );
};
