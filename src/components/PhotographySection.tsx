import { useMemo, useState } from "react";
import type { Lang, PhotoAlbum, PhotoItem, Translations } from "../data/portfolio";
import type { LocaleText } from "../data/types";
import type { GalleryItem } from "./Lightbox";

interface PhotographySectionProps {
  t: Translations;
  lang: Lang;
  albums: PhotoAlbum[];
  onOpenGallery: (title: string, items: GalleryItem[], index: number) => void;
}

// Place / event of a photo, from its album sub-folder (several folders can share a label, e.g. two "Irlande")
const placeOf = (album: PhotoAlbum, item: PhotoItem): LocaleText =>
  album.places?.[item.group] ?? { FR: item.desc, ENG: item.desc };

export function PhotographySection({ t, lang, albums, onOpenGallery }: PhotographySectionProps) {
  const [albumId, setAlbumId] = useState(albums[0]?.id);
  const [sub, setSub] = useState<string | null>(null);
  const album = albums.find((a) => a.id === albumId) ?? albums[0];

  // Second filter: one button per place / event, in order of first appearance
  const subs = useMemo(() => {
    const list: { key: string; label: string; count: number }[] = [];
    album?.items.forEach((item) => {
      const place = placeOf(album, item);
      const existing = list.find((s) => s.key === place.FR);
      if (existing) existing.count++;
      else list.push({ key: place.FR, label: place[lang], count: 1 });
    });
    return list;
  }, [album, lang]);
  const hasSubs = subs.length > 1;
  // No "all" filter: default to the first place / event
  const activeSub = hasSubs ? (subs.some((s) => s.key === sub) ? sub : subs[0].key) : null;

  if (!album) return null;

  const items = album.items.filter((item) => activeSub === null || placeOf(album, item).FR === activeSub);
  const activeSubLabel = subs.find((s) => s.key === activeSub)?.label;
  const viewerTitle = activeSub === null ? album.title[lang] : `${album.title[lang]} · ${activeSubLabel}`;
  const gallery: GalleryItem[] = items.map((item) => ({ src: item.url, alt: `${album.title[lang]} · ${placeOf(album, item)[lang]}` }));
  const ratio = album.format === "portrait" ? "aspect-[4/5]" : "aspect-square";

  return (
    <section
      id="photographies"
      aria-labelledby="ph-t"
      className="scroll-mt-16 desk:scroll-mt-0 mt-[clamp(96px,10vw,150px)] bg-ink text-rose py-[clamp(72px,9vw,120px)] px-[clamp(20px,4vw,64px)]"
    >
      <div className="flex flex-wrap justify-between items-end gap-x-10 gap-y-5 mb-5">
        <h2 id="ph-t" className="m-0 text-[clamp(56px,7vw,120px)] font-extrabold leading-[0.9] tracking-[-0.04em]">
          {t.photoTitleStart}
          <span className="text-pink">{t.photoTitleEnd}</span>
        </h2>
        <div role="tablist" aria-label={t.series} className="flex flex-wrap gap-2">
          {albums.map((a) => {
            const on = a.id === album.id;
            return (
              <button
                key={a.id}
                type="button"
                role="tab"
                id={`photo-tab-${a.id}`}
                aria-selected={on}
                aria-controls="photo-panel"
                onClick={() => {
                  setAlbumId(a.id);
                  setSub(null);
                }}
                className={`min-h-[46px] px-5 rounded-full border-[1.5px] border-rose text-base font-bold cursor-pointer ${on ? "bg-rose text-ink" : "bg-transparent text-rose hover:bg-rose/15"}`}
              >
                {a.title[lang]} <span className="opacity-65">{a.items.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="photo-panel" role="tabpanel" aria-labelledby={`photo-tab-${album.id}`}>
        <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-3 mb-7">
          {album.description && (
            <p className="flex-[1_1_420px] m-0 text-[clamp(21px,1.8vw,26px)] leading-[1.4] font-medium">{album.description[lang]}</p>
          )}
          {album.articleImages?.length ? (
            <button
              type="button"
              onClick={() => onOpenGallery(t.articleTitle, album.articleImages!.map((src) => ({ src, alt: t.articleAlt })), 0)}
              className="min-h-12 px-5 rounded-full bg-rose text-ink border-0 text-base font-bold cursor-pointer hover:bg-pink"
            >
              {t.readArticle} ↗
            </button>
          ) : null}
        </div>

        {hasSubs && (
          <div
            role="group"
            aria-label={album.filter === "evenement" ? t.byEvent : t.byCountry}
            className="flex flex-wrap items-center gap-2 mb-7 pt-5 border-t border-rose/25"
          >
            {subs.map((s) => {
              const on = activeSub === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSub(s.key)}
                  aria-pressed={on}
                  className={`min-h-[44px] px-4 rounded-full border text-[15px] font-semibold cursor-pointer ${
                    on ? "bg-pink text-ink border-pink" : "bg-transparent text-rose border-rose/45 hover:border-rose"
                  }`}
                >
                  {s.label} <span className="opacity-65">{s.count}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-3">
          {items.map((item, i) => (
            <button
              key={item.srcPath}
              type="button"
              onClick={() => onOpenGallery(viewerTitle, gallery, i)}
              aria-label={gallery[i].alt}
              className="tile relative block p-0 border-0 rounded-[14px] overflow-hidden bg-tile cursor-zoom-in"
            >
              <img src={item.url} alt="" loading="lazy" className={`block w-full ${ratio} object-cover`} />
              <span className="absolute left-2.5 bottom-2.5 px-2.5 py-[3px] rounded-full bg-ink/75 text-rose text-[13px] font-semibold">
                {placeOf(album, item)[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
