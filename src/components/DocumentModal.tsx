import { useEffect, useRef, useState } from "react";
import { DOCUMENTS, type Lang, type Translations } from "../data/portfolio";

export type DocumentKind = "cv" | "project";

interface DocumentModalProps {
  t: Translations;
  lang: Lang;
  kind: DocumentKind;
  onClose: () => void;
}

// CV and documentary project windows: black background (like the sidebar), pink buttons, FR/EN choice for the CV
export function DocumentModal({ t, lang, kind, onClose }: DocumentModalProps) {
  const [cvLang, setCvLang] = useState<Lang>(lang);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isCv = kind === "cv";
  const title = isCv ? t.cvTitle : t.projectTitle;
  const src = isCv ? (cvLang === "FR" ? DOCUMENTS.cvFr : DOCUMENTS.cvEn) : DOCUMENTS.project;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] bg-ink text-rose flex flex-col">
      <div className="flex flex-wrap justify-between items-center gap-3 py-2.5 px-[clamp(16px,3vw,32px)] border-b-2 border-rose/25">
        <span className="text-[17px] font-bold">{title}</span>
        <div className="flex items-center gap-2">
          {isCv && (
            <div role="group" aria-label={t.language} className="flex gap-2">
              {(["FR", "ENG"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setCvLang(l)}
                  aria-pressed={cvLang === l}
                  className={`min-w-[52px] min-h-[44px] rounded-full border-[1.5px] border-rose text-[15px] font-bold cursor-pointer ${cvLang === l ? "bg-rose text-ink" : "bg-transparent text-rose hover:bg-rose/15"}`}
                >
                  {l === "FR" ? "FR" : "EN"}
                </button>
              ))}
            </div>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-[46px] px-[18px] bg-rose rounded-full text-ink text-base font-bold cursor-pointer hover:bg-pink"
          >
            {t.close} ✕
          </button>
        </div>
      </div>
      <div className="flex-[1_1_auto] min-h-0 p-[clamp(8px,2vw,24px)]">
        <iframe key={src} src={src} title={title} className="w-full h-full border-0 rounded-md bg-white" />
      </div>
    </div>
  );
}
