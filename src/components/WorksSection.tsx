import { useState } from "react";
import type { Lang, Translations } from "../data/portfolio";
import type { ProjectData } from "../data/types";
import type { GalleryItem } from "./Lightbox";

export type WorkCategory = "all" | ProjectData["category"];

interface WorksSectionProps {
  t: Translations;
  lang: Lang;
  projects: ProjectData[];
  category: WorkCategory;
  setCategory: (c: WorkCategory) => void;
  onOpenGallery: (title: string, items: GalleryItem[], index: number) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

function getYouTubeId(url: string): string | null {
  if (!url || url === "#") return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
}

export function WorksSection({ t, lang, projects, category, setCategory, onOpenGallery }: WorksSectionProps) {
  // All rows start closed
  const [openId, setOpenId] = useState<string | null>(null);
  const shown = category === "all" ? projects : projects.filter((p) => p.category === category);

  const cats: { id: WorkCategory; label: string; count: number }[] = [
    { id: "all", label: t.all, count: projects.length },
    ...(["film", "documentary", "experience"] as const).map((c) => ({
      id: c,
      label: t.catPlural[c],
      count: projects.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <section id="travaux" aria-labelledby="tr-t" className="scroll-mt-16 desk:scroll-mt-0 pt-[clamp(96px,10vw,150px)] px-[clamp(20px,4vw,64px)]">
      <div className="flex flex-wrap justify-between items-end gap-x-10 gap-y-5 mb-7">
        <h2 id="tr-t" className="m-0 text-[clamp(56px,7vw,120px)] font-extrabold leading-[0.9] tracking-[-0.04em]">
          {t.works}
          <sup className="text-[0.3em] font-bold text-accent align-top ml-1.5">{pad(shown.length)}</sup>
        </h2>
        <div role="tablist" aria-label={t.categories} className="flex flex-wrap gap-2">
          {cats.map((c) => {
            const on = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`works-tab-${c.id}`}
                aria-selected={on}
                aria-controls="works-panel"
                onClick={() => setCategory(c.id)}
                className={`min-h-[46px] px-5 rounded-full border-[1.5px] border-ink text-base font-bold cursor-pointer ${on ? "bg-ink text-rose" : "bg-transparent text-ink hover:bg-ink/10"}`}
              >
                {c.label} <span className="opacity-65">{c.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="works-panel" role="tabpanel" aria-labelledby={`works-tab-${category}`}>
        <ul className="list-none m-0 p-0 border-t-2 border-ink">
          {shown.map((p, i) => (
            <WorkRow
              key={p.id}
              project={p}
              num={pad(i + 1)}
              t={t}
              lang={lang}
              open={openId === p.id}
              onToggle={() => setOpenId((id) => (id === p.id ? null : p.id))}
              onOpenGallery={onOpenGallery}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

interface WorkRowProps {
  key?: string; // the project has no @types/react, so JSX does not know about `key` by itself
  project: ProjectData;
  num: string;
  t: Translations;
  lang: Lang;
  open: boolean;
  onToggle: () => void;
  onOpenGallery: WorksSectionProps["onOpenGallery"];
}

function WorkRow({ project: p, num, t, lang, open, onToggle, onOpenGallery }: WorkRowProps) {
  const [playing, setPlaying] = useState(false);
  const cover = p.images[0];
  const hasVideo = p.videoUrl !== "#";
  const youtubeId = getYouTubeId(p.videoUrl);
  const catLabel = t.catSingular[p.category];
  const panelId = `w-${p.id}-panel`;

  // Fallback target when there is no image: the video, else the first link
  const mainUrl = hasVideo ? p.videoUrl : p.links?.[0]?.url;
  const mainLabel = hasVideo ? (youtubeId ? t.watchOnYoutube : t.watchVideo) : p.links?.[0]?.label[lang] ?? "";

  const facts = [
    { k: t.roles, v: p.role[lang] },
    ...(p.duration ? [{ k: t.duration, v: p.duration }] : []),
    ...(p.composition ? [{ k: t.composition, v: p.composition[lang] }] : []),
    ...(p.producer ? [{ k: t.production, v: p.producer }] : []),
  ];

  const links = [
    ...(hasVideo ? [{ label: t.watchVideo, url: p.videoUrl }] : []),
    ...(p.links ?? []).map((l) => ({ label: l.label[lang], url: l.url })),
  ];

  const gallery = (imgs: string[], suffix: string): GalleryItem[] =>
    imgs.map((src, i) => ({ src, alt: `${p.title}${suffix}, ${t.stillOf.toLowerCase()} ${i + 1}` }));
  const stills = gallery(p.images, "");
  const bts = p.behindTheScenes ?? [];

  return (
    <li id={`w-${p.id}`} className="border-b-2 border-ink">
      <button
        type="button"
        className="work-row relative w-full py-[22px] bg-transparent border-0 text-ink text-left cursor-pointer"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="work-meta work-num shrink-0 basis-10 text-base font-bold text-accent">{num}</span>
        <span className="work-title flex-[0_1_auto] min-w-0 text-[clamp(32px,4vw,60px)] font-extrabold leading-none tracking-[-0.035em] transition-colors duration-200">
          {p.title}
        </span>
        {cover && (
          <span className="pv" aria-hidden="true">
            <img src={cover} alt="" loading="lazy" />
          </span>
        )}
        <span aria-hidden="true" className="work-spacer flex-[1_1_0] min-w-0" />
        <span className="work-meta work-info shrink-0 basis-[180px] text-base leading-[1.4] text-muted">
          {catLabel} · {p.year}
          <br />
          {p.type[lang]}
        </span>
        <span
          aria-hidden="true"
          className={`work-meta work-sign shrink-0 w-11 h-11 rounded-full border-[1.5px] border-ink flex items-center justify-center text-[22px] font-medium ${open ? "bg-ink text-rose" : ""}`}
        >
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div id={panelId} className="flex flex-wrap gap-y-7 gap-x-[clamp(28px,4vw,56px)] pt-2 pb-10">
          <div className="flex-[1.3_1_420px] min-w-0">
            {cover ? (
              <div className="relative rounded-[18px] overflow-hidden bg-ink aspect-video">
                {playing && youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
                    title={p.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <img src={cover} alt={`${t.imageOf} ${p.title}`} className="block w-full h-full object-cover" />
                )}
                {/* The whole preview starts the video; the pill is only the visual cue */}
                {hasVideo && !playing && (
                  youtubeId ? (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      aria-label={`${t.play}, ${p.title}`}
                      className="group absolute inset-0 p-0 bg-transparent border-0 cursor-pointer"
                    >
                      <PlayPill label={t.play} duration={p.duration} />
                    </button>
                  ) : (
                    <a
                      href={p.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.play}, ${p.title}`}
                      className="group absolute inset-0 no-underline"
                    >
                      <PlayPill label={t.play} duration={p.duration} />
                    </a>
                  )
                )}
              </div>
            ) : (
              <a
                href={mainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between aspect-video p-[clamp(20px,3vw,36px)] rounded-[18px] bg-ink text-rose no-underline group"
              >
                <span className="text-[15px] font-bold text-pink">
                  {catLabel} · {p.year}
                </span>
                <span className="text-[clamp(36px,4.4vw,64px)] font-extrabold leading-[0.95] tracking-[-0.035em]">{p.title}</span>
                <span className="inline-flex items-center gap-2.5 text-[17px] font-semibold group-hover:text-pink">{mainLabel} ↗</span>
              </a>
            )}

            {stills.length > 1 && (
              <div className="flex gap-2.5 mt-2.5">
                {stills.slice(0, 4).map((st, i) => (
                  <button
                    key={st.src}
                    type="button"
                    onClick={() => onOpenGallery(p.title, stills, i)}
                    aria-label={st.alt}
                    className="tile flex-[1_1_0] min-w-0 p-0 border-0 rounded-xl overflow-hidden bg-ink cursor-zoom-in"
                  >
                    <img src={st.src} alt="" loading="lazy" className="block w-full aspect-video object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-[1_1_340px] min-w-0">
            <p className="m-0 mb-[22px] text-xl leading-[1.6]">{p.description[lang]}</p>
            <dl className="m-0 mb-6 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
              {facts.map((f) => (
                <div key={f.k} className="px-4 py-3.5 bg-white rounded-xl">
                  <dt className="text-[13px] font-bold tracking-[0.04em] uppercase text-accent">{f.k}</dt>
                  <dd className="mt-1 mb-0 mx-0 text-[17px] leading-[1.4]">{f.v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2.5">
              {links.map((l, j) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center min-h-12 px-5 rounded-full border-[1.5px] border-ink text-base font-bold no-underline ${
                    j === 0 ? "bg-ink text-rose hover:bg-accent hover:border-accent" : "bg-transparent text-ink hover:bg-ink/10"
                  }`}
                >
                  {l.label} ↗
                </a>
              ))}
              {bts.length > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenGallery(`${p.title} · ${t.behindScenes.toLowerCase()}`, gallery(bts, `, ${t.behindScenes.toLowerCase()}`), 0)}
                  className="min-h-12 px-5 rounded-full bg-pink text-ink border-[1.5px] border-ink text-base font-bold cursor-pointer hover:bg-rose"
                >
                  {t.behindScenes} · {bts.length} {t.photos}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function PlayPill({ label, duration }: { label: string; duration?: string | null }) {
  return (
    <span className="absolute left-[18px] bottom-[18px] inline-flex items-center gap-2.5 min-h-12 px-5 rounded-full bg-rose text-ink text-base font-bold group-hover:bg-pink">
      <PlayIcon />
      {label}
      {duration ? ` · ${duration}` : ""}
    </span>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
      <path d="M0 0v14l12-7z" fill="currentColor" />
    </svg>
  );
}
