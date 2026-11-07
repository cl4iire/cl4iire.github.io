import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Copy, RotateCcw, Save, X } from "lucide-react";
import { PHOTOGRAPHY_ALBUMS, orderKey } from "../data/portfolio";

// Hidden page (`?editor`) to reorder the photos of each album by drag & drop.
// In dev, "Enregistrer" writes the order to src/data/projects/photographies/<album>.ts
// through the photo-order-plugin endpoint. Online (static site), the order can only be copied.

type Photo = { key: string; url: string; place: string };
type EditableAlbum = { id: string; title: string; photos: Photo[] };

const CAN_SAVE = import.meta.env.DEV;

const toEditable = (): EditableAlbum[] =>
  PHOTOGRAPHY_ALBUMS.map((a) => ({
    id: a.id,
    title: a.title.FR,
    photos: a.items.map((p) => ({ key: orderKey(a.id, p.srcPath), url: p.url, place: p.desc })),
  }));

// Code to send / paste: names the target file, then the order block to put in it
const orderCode = (album: EditableAlbum) =>
  `// Album ${album.title} : remplacer le bloc order dans src/data/projects/photographies/${album.id}.ts\n` +
  `  order: [\n${album.photos.map((p) => `    '${p.key}',`).join("\n")}\n  ],`;

export default function PhotoOrderEditor() {
  const initial = useRef(toEditable());
  const [albums, setAlbums] = useState<EditableAlbum[]>(initial.current);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [drag, setDrag] = useState<{ albumId: string; index: number } | null>(null);
  const [over, setOver] = useState<{ albumId: string; index: number } | null>(null);
  const [codeShown, setCodeShown] = useState<Record<string, boolean>>({});

  const setAlbumStatus = (albumId: string, msg: string) => setStatus((s) => ({ ...s, [albumId]: msg }));

  const move = (albumId: string, from: number, to: number) => {
    if (from === to) return;
    setAlbums((prev) =>
      prev.map((a) => {
        if (a.id !== albumId) return a;
        const photos = [...a.photos];
        const [photo] = photos.splice(from, 1);
        photos.splice(to, 0, photo);
        return { ...a, photos };
      })
    );
    setDirty((d) => ({ ...d, [albumId]: true }));
    setAlbumStatus(albumId, "");
  };

  const reset = (albumId: string) => {
    const original = initial.current.find((a) => a.id === albumId);
    if (!original) return;
    setAlbums((prev) => prev.map((a) => (a.id === albumId ? original : a)));
    setDirty((d) => ({ ...d, [albumId]: false }));
    setAlbumStatus(albumId, "");
  };

  const save = async (album: EditableAlbum) => {
    setAlbumStatus(album.id, "Enregistrement...");
    try {
      const res = await fetch("/__photo-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumId: album.id, order: album.photos.map((p) => p.key) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || res.statusText);
      // The saved order becomes the new reference for "Annuler"
      initial.current = initial.current.map((a) => (a.id === album.id ? album : a));
      setDirty((d) => ({ ...d, [album.id]: false }));
      setAlbumStatus(album.id, `Enregistré dans ${data.file}`);
    } catch (e) {
      setAlbumStatus(album.id, `Erreur : ${(e as Error).message}`);
    }
  };

  // Shows the code in a box (to copy and send) and also tries to put it in the clipboard
  const copy = async (album: EditableAlbum) => {
    setCodeShown((c) => ({ ...c, [album.id]: true }));
    try {
      await navigator.clipboard.writeText(orderCode(album));
      setAlbumStatus(album.id, "Code copié ! Il suffit de le coller dans un message. Il est aussi affiché ci-dessous.");
    } catch {
      setAlbumStatus(album.id, "Cliquer dans le code ci-dessous puis faire Ctrl+C pour le copier.");
    }
  };

  const siteUrl = import.meta.env.BASE_URL + "#photography";

  return (
    <div className="min-h-screen bg-bg text-text font-mono px-4 md:px-10 py-10">
      <header className="max-w-7xl mx-auto mb-12 space-y-4">
        <a href={siteUrl} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition">
          <ArrowLeft size={14} /> Retour au site
        </a>
        <h1 className="text-4xl md:text-5xl font-display uppercase">Ordre des photos</h1>
        <p className="text-sm opacity-70 max-w-3xl leading-relaxed">
          Glisser-déposer une photo pour la déplacer, ou utiliser les flèches sous chaque photo.
          Le numéro en rouge est sa position sur le site.{" "}
          {CAN_SAVE
            ? "Cliquer sur « Enregistrer » sous l'album : le site se met à jour immédiatement."
            : "Une fois l'ordre choisi, cliquer sur « Copier le code » sous l'album, puis envoyer ce code par message."}
        </p>
      </header>

      <div className="max-w-7xl mx-auto space-y-20">
        {albums.map((album) => (
          <section key={album.id}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-title-20 pb-4">
              <h2 className="text-sm uppercase tracking-[0.3em] border-l-2 border-accent pl-4">
                {album.title} <span className="opacity-40">({album.photos.length})</span>
                {dirty[album.id] && <span className="ml-3 text-accent normal-case tracking-normal">modifié</span>}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest">
                {CAN_SAVE && (
                  <button
                    onClick={() => save(album)}
                    disabled={!dirty[album.id]}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-title font-bold disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  >
                    <Save size={14} /> Enregistrer
                  </button>
                )}
                <button onClick={() => copy(album)} className="inline-flex items-center gap-2 px-4 py-2 border border-title-20 hover:bg-title-10 cursor-pointer">
                  <Copy size={14} /> Copier le code
                </button>
                <button
                  onClick={() => reset(album.id)}
                  disabled={!dirty[album.id]}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-title-20 hover:bg-title-10 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  <RotateCcw size={14} /> Annuler
                </button>
              </div>
            </div>
            {status[album.id] && <p className="text-xs mb-4 text-accent">{status[album.id]}</p>}

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
              {album.photos.map((photo, i) => {
                const isOver = over?.albumId === album.id && over.index === i && drag?.index !== i;
                return (
                  <div
                    key={photo.key}
                    draggable
                    onDragStart={(e) => {
                      setDrag({ albumId: album.id, index: i });
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      if (drag?.albumId !== album.id) return;
                      e.preventDefault();
                      if (over?.index !== i || over?.albumId !== album.id) setOver({ albumId: album.id, index: i });
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (drag?.albumId === album.id) move(album.id, drag.index, i);
                      setDrag(null);
                      setOver(null);
                    }}
                    onDragEnd={() => {
                      setDrag(null);
                      setOver(null);
                    }}
                    className={`relative group bg-title-5 cursor-grab active:cursor-grabbing transition ${
                      drag?.albumId === album.id && drag.index === i ? "opacity-30" : ""
                    } ${isOver ? "outline outline-2 outline-[var(--color-accent)]" : ""}`}
                    title={photo.key}
                  >
                    <img src={photo.url} alt={photo.key} loading="lazy" draggable={false} className="w-full aspect-square object-cover select-none" />
                    <span className="absolute top-1 left-1 min-w-6 h-6 px-1 flex items-center justify-center text-[11px] font-bold bg-accent text-title">
                      {i + 1}
                    </span>
                    <div className="flex items-center justify-between gap-1 px-1 py-1 text-[9px] uppercase tracking-wider">
                      <button
                        onClick={() => move(album.id, i, i - 1)}
                        disabled={i === 0}
                        className="p-1 opacity-60 hover:opacity-100 disabled:opacity-10 cursor-pointer"
                        aria-label="Déplacer avant"
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <span className="truncate opacity-50">{photo.place}</span>
                      <button
                        onClick={() => move(album.id, i, i + 1)}
                        disabled={i === album.photos.length - 1}
                        className="p-1 opacity-60 hover:opacity-100 disabled:opacity-10 cursor-pointer"
                        aria-label="Déplacer après"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {codeShown[album.id] && (
              <div className="mt-6 border border-accent">
                <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-title-20 text-xs uppercase tracking-widest">
                  <span>Code à envoyer - {album.title}</span>
                  <button
                    onClick={() => setCodeShown((c) => ({ ...c, [album.id]: false }))}
                    className="opacity-60 hover:opacity-100 cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <textarea
                  readOnly
                  value={orderCode(album)}
                  onFocus={(e) => e.currentTarget.select()}
                  rows={Math.min(album.photos.length + 3, 18)}
                  className="w-full p-4 bg-title-5 text-text text-xs font-mono leading-relaxed resize-y outline-none"
                />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
