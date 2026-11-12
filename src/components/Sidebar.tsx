import { useEffect, useRef } from "react";
import type { Lang, Translations } from "../data/portfolio";
import type { WorkCategory } from "./WorksSection";

export type SectionId = "top" | "travaux" | "photographies" | "contact";

interface SidebarProps {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
  activeSection: SectionId;
  category: WorkCategory;
  onNavigate: (category: WorkCategory | null) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onOpenCv: () => void;
  onOpenProject: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");
const LANGS: { id: Lang; label: string }[] = [
  { id: "FR", label: "FR" },
  { id: "ENG", label: "EN" },
];

export function Sidebar({
  t,
  lang,
  setLang,
  activeSection,
  category,
  onNavigate,
  menuOpen,
  setMenuOpen,
  onOpenCv,
  onOpenProject,
}: SidebarProps) {
  // Films / Documentaries / Experience all lead to the filtered "Work" list
  const nav: { href: string; label: string; cat: WorkCategory | null; section: SectionId }[] = [
    { href: "#travaux", label: t.nav.films, cat: "film", section: "travaux" },
    { href: "#travaux", label: t.nav.documentaries, cat: "documentary", section: "travaux" },
    { href: "#travaux", label: t.nav.experiences, cat: "experience", section: "travaux" },
    { href: "#photographies", label: t.nav.photography, cat: null, section: "photographies" },
    { href: "#contact", label: t.nav.contact, cat: null, section: "contact" },
  ];
  const isCurrent = (n: (typeof nav)[number]) => n.section === activeSection && (n.cat === null || n.cat === category);

  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    menuCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen, setMenuOpen]);

  const langSwitch = (
    <div role="group" aria-label={t.language} className="flex border-[1.5px] border-rose rounded-full overflow-hidden">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLang(l.id)}
          aria-pressed={lang === l.id}
          className={`min-w-[46px] min-h-[44px] text-sm font-bold cursor-pointer ${lang === l.id ? "bg-rose text-ink" : "bg-transparent text-rose"}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="desk:hidden sticky top-0 z-40 flex items-center justify-between py-2 pr-2 pl-5 bg-ink text-rose">
        <a href="#top" className="no-underline text-[22px] font-extrabold tracking-[-0.02em]">
          Claire B.L
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t.openMenu}
          aria-expanded={menuOpen}
          className="min-h-12 px-4 bg-rose rounded-full text-ink text-base font-bold cursor-pointer"
        >
          {t.menu}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        aria-label={t.navigation}
        className="hidden desk:flex sticky top-0 h-screen shrink-0 basis-[272px] w-[272px] flex-col justify-between overflow-y-auto px-7 py-8 bg-ink text-rose"
      >
        <div>
          <a href="#top" className="block no-underline">
            <span className="block text-[34px] font-extrabold leading-[0.95] tracking-[-0.03em]">
              Claire
              <br />
              Buhaceanu
              <br />
              Laborde
            </span>
            <span className="block mt-3 text-base font-semibold text-pink">{t.subtitle}</span>
          </a>
          <nav aria-label={t.sections} className="mt-12">
            <ul className="list-none m-0 p-0">
              {nav.map((n, i) => {
                const on = isCurrent(n);
                return (
                  <li key={n.label}>
                    <a
                      href={n.href}
                      onClick={() => onNavigate(n.cat)}
                      aria-current={on ? "true" : undefined}
                      className={`flex items-baseline gap-3.5 min-h-[50px] py-2 border-b border-line no-underline ${on ? "text-pink" : "text-rose hover:text-pink"}`}
                    >
                      <span className="text-[13px] font-semibold text-pink">{pad(i + 1)}</span>
                      <span className={`text-[21px] tracking-[-0.01em] ${on ? "font-bold" : "font-medium"}`}>{n.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex flex-col gap-2 mt-7">
            <button
              type="button"
              onClick={onOpenCv}
              className="min-h-[46px] px-[18px] rounded-full bg-rose text-ink text-base font-bold text-left cursor-pointer hover:bg-pink"
            >
              {t.cvButton} ↗
            </button>
            <button
              type="button"
              onClick={onOpenProject}
              className="min-h-[46px] px-[18px] rounded-full bg-transparent text-rose border-[1.5px] border-rose text-base font-semibold text-left cursor-pointer hover:bg-rose hover:text-ink"
            >
              {t.projectButton}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center gap-3 mt-8">
          <a href="mailto:claire.blaborde@gmail.com" className="text-sm underline-offset-4 min-h-[44px] inline-flex items-center">
            {t.writeTo}
          </a>
          {langSwitch}
        </div>
      </aside>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label={t.menu} className="desk:hidden fixed inset-0 z-[90] bg-ink text-rose flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center py-2 pr-2 pl-5">
            <span className="text-[22px] font-extrabold">Claire B.L</span>
            <button
              ref={menuCloseRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={t.closeMenu}
              className="min-h-12 px-4 bg-rose rounded-full text-ink text-base font-bold cursor-pointer"
            >
              {t.close}
            </button>
          </div>
          <nav aria-label={t.sections} className="px-5 py-4">
            {nav.map((n, i) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => {
                  onNavigate(n.cat);
                  setMenuOpen(false);
                }}
                className="flex items-baseline gap-3.5 min-h-16 py-1.5 border-b border-line no-underline"
              >
                <span className="text-sm font-bold text-pink">{pad(i + 1)}</span>
                <span className="text-[40px] font-extrabold tracking-[-0.03em] leading-tight">{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap gap-2.5 px-5 pt-3 pb-7">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenCv();
              }}
              className="min-h-12 px-[22px] rounded-full bg-rose text-ink text-base font-bold cursor-pointer"
            >
              {t.cvButton}
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenProject();
              }}
              className="min-h-12 px-[22px] rounded-full bg-transparent text-rose border-[1.5px] border-rose text-base font-bold cursor-pointer"
            >
              {t.projectShort}
            </button>
          </div>
          <div className="flex justify-between items-center gap-3 px-5 pb-8 mt-auto">
            <a href="mailto:claire.blaborde@gmail.com" className="text-base min-h-[44px] inline-flex items-center">
              {t.writeTo}
            </a>
            {langSwitch}
          </div>
        </div>
      )}
    </>
  );
}
