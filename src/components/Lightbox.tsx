import { useEffect, useRef } from "react";
import type { Translations } from "../data/portfolio";

export type GalleryItem = { src: string; alt: string };
export type Gallery = { title: string; items: GalleryItem[]; index: number };

interface LightboxProps {
  t: Translations;
  gallery: Gallery;
  setIndex: (index: number) => void;
  onClose: () => void;
}

// Full-screen viewer: only goes through the list it was given (e.g. the filtered photos)
export function Lightbox({ t, gallery, setIndex, onClose }: LightboxProps) {
  const { title, items, index } = gallery;
  const count = items.length;
  const item = items[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const step = (d: number) => setIndex((index + d + count) % count);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (count > 1 && e.key === "ArrowLeft") step(-1);
      if (count > 1 && e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!item) return null;

  const navButton = "min-h-12 px-5 rounded-full bg-transparent border-[1.5px] border-rose text-rose text-base font-bold cursor-pointer hover:bg-rose hover:text-ink";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${t.viewer}, ${title}`}
      className="fixed inset-0 z-[100] bg-ink text-rose flex flex-col"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null || count < 2) return;
        const diff = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) step(diff > 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex justify-between items-center gap-4 py-2.5 px-[clamp(16px,3vw,32px)]">
        <span className="text-[17px] font-bold">{title}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="min-h-[46px] px-[18px] bg-rose rounded-full text-ink text-base font-bold cursor-pointer hover:bg-pink"
        >
          {t.close} ✕
        </button>
      </div>
      <div className="flex-[1_1_auto] min-h-0 flex items-center justify-center px-4">
        <img key={item.src} src={item.src} alt={item.alt} className="max-w-full max-h-[78vh] object-contain rounded-[10px]" />
      </div>
      <div className="flex justify-center items-center gap-[18px] p-4">
        {count > 1 && (
          <button type="button" onClick={() => step(-1)} className={navButton}>
            ← {t.prev}
          </button>
        )}
        <span className="text-base font-semibold" aria-live="polite">
          {index + 1} / {count}
        </span>
        {count > 1 && (
          <button type="button" onClick={() => step(1)} className={navButton}>
            {t.next} →
          </button>
        )}
      </div>
    </div>
  );
}
