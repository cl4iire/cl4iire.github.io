import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import cvFr from "../assets/CV/B.Laborde Claire FR CV 2026.pdf?url";
import cvEn from "../assets/CV/B.Laborde Claire ENG CV 2026.pdf?url";

interface CvViewerProps {
  lang: 'FR' | 'ENG';
  onClose: () => void;
}

export const CvViewer = ({ lang, onClose }: CvViewerProps) => {
  const [activeLang, setActiveLang] = useState<'FR' | 'ENG'>(lang);
  const src = activeLang === 'FR' ? cvFr : cvEn;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-bg-95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-title-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-title opacity-60">CV</p>

        <div className="flex items-center gap-6">
          {/* Language switcher */}
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em]">
            <button
              onClick={() => setActiveLang('FR')}
              className={`transition-opacity cursor-pointer ${activeLang === 'FR' ? 'text-accent font-bold opacity-100' : 'text-title opacity-40 hover:opacity-100'}`}
            >
              FR
            </button>
            <span className="text-title opacity-20">|</span>
            <button
              onClick={() => setActiveLang('ENG')}
              className={`transition-opacity cursor-pointer ${activeLang === 'ENG' ? 'text-accent font-bold opacity-100' : 'text-title opacity-40 hover:opacity-100'}`}
            >
              ENG
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-title opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Close CV viewer"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <iframe
          key={activeLang}
          src={src}
          title={`CV - Claire Buhaceanu Laborde (${activeLang})`}
          className="w-full h-full border-0"
        />
      </div>
    </motion.div>
  );
};
