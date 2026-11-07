import { useState } from "react";
import { motion } from "motion/react";
import { Play, ArrowRight, ChevronDown, X, FileText, ExternalLink } from "lucide-react";
import { LazyImage } from "./LazyImage";

function getYouTubeId(url: string): string | null {
  if (!url || url === '#') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getYouTubeEmbedUrl(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function YouTubeFacade({ embedUrl, videoId, title }: { embedUrl: string; videoId: string; title: string }) {
  const [active, setActive] = useState(false);
  if (active) {
    return (
      <iframe
        src={`${embedUrl}?autoplay=1`}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    );
  }
  return (
    <div
      className="relative w-full h-full cursor-pointer group"
      onClick={() => setActive(true)}
      style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-bg-20 group-hover:bg-bg-40 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-title-90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play size={28} className="text-bg fill-bg ml-1" />
        </div>
      </div>
    </div>
  );
}

// Shown instead of a cover image when a project has no stills and no YouTube embed:
// a play button for a video page, an external-link icon for a plain link (e.g. a TikTok account)
function CoverLinkCard({ href, title, label, isVideo }: { href?: string; title: string; label: string; isVideo: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex flex-col items-center justify-center w-full h-full px-6 text-center border border-title-20 bg-title-5 hover:bg-title-10 transition-colors cursor-pointer group"
    >
      <div className="w-16 h-16 rounded-full bg-title-90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        {isVideo
          ? <Play size={28} className="text-bg fill-bg ml-1" />
          : <ExternalLink size={26} className="text-bg" />}
      </div>
      <p className="mt-6 text-2xl md:text-4xl font-display uppercase leading-tight">{title}</p>
      <p className="mt-2 text-[10px] uppercase tracking-widest opacity-50 group-hover:text-accent group-hover:opacity-100 transition-colors">{label}</p>
    </a>
  );
}

interface ProjectItemProps {
  key?: any;
  project: any;
  idx: number;
  t: any;
  lang: string;
  onImageClick: (images: string[], index: number) => void;
}

export const ProjectItem = ({ project, idx, t, lang, onImageClick }: ProjectItemProps) => {
  const videoImage = project.images[0];
  const videoId = getYouTubeId(project.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  // When YouTube is embedded, the first image is no longer shown as cover - include all images in the grid
  const otherImages = embedUrl ? project.images : project.images.slice(1);
  const [showBTS, setShowBTS] = useState(true);
  const [showDoc, setShowDoc] = useState(false);
  // Target of the cover card when the project has no image: the video, or else its first extra link
  const hasVideo = project.videoUrl !== '#';
  const primaryLink = project.videoUrl !== '#' ? project.videoUrl : project.links?.[0]?.url;
  const primaryLabel = project.videoUrl !== '#' ? t.playReel : (project.links?.[0]?.label[lang] ?? '');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
    >
      {/* Script Info Column */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">{t.extScene} {idx + 1} - {t.day}</span>
          <h3 className="text-4xl md:text-5xl font-display uppercase leading-tight">"{project.title}"</h3>
          <p className="text-sm opacity-60 italic">{project.year} - {project.type}</p>
          {project.producer && (
            <p className="text-[10px] opacity-40 uppercase tracking-widest">{t.producedBy} {project.producer}</p>
          )}
        </div>

        {/* Video Embed - Mobile Only (Above Script Page) */}
        <div className="lg:hidden">
          <div
            className="relative overflow-hidden bg-bg"
            style={{ aspectRatio: '16/9' }}
          >
            {embedUrl && videoId ? (
              <YouTubeFacade embedUrl={embedUrl} videoId={videoId} title={project.title} />
            ) : videoImage ? (
              <div className="relative w-full h-full">
                <LazyImage
                  src={videoImage}
                  className="w-full h-full cursor-pointer"
                  imgClassName="hover:grayscale-0"
                  alt={`${project.title} video`}
                  onClick={() => onImageClick(project.images, 0)}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-bg-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => onImageClick(project.images, 0)}
                >
                  <Play size={32} className="text-title fill-title" />
                </div>
              </div>
            ) : (
              <CoverLinkCard href={primaryLink} title={project.title} label={primaryLabel} isVideo={hasVideo} />
            )}
          </div>
        </div>

        <div className="p-8 bg-white script-page border border-zinc-200 relative">
          <div className="tape tape-top" />
          <div className="absolute top-4 right-4 text-[10px] opacity-20">FILE_REF: {project.id.toUpperCase()}</div>
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <span className="font-bold block mb-1 uppercase text-[10px] tracking-tighter opacity-40">{t.roles}</span>
              <p className="">{project.role[lang]}</p>
            </div>
            
            {project.duration && (
              <div>
                <span className="font-bold block mb-1 uppercase text-[10px] tracking-tighter opacity-40">{t.duration}</span>
                <p>{project.duration}</p>
              </div>
            )}

            {project.composition && (
              <div>
                <span className="font-bold block mb-1 uppercase text-[10px] tracking-tighter opacity-40">{t.composition}</span>
                <p className="italic">{project.composition[lang]}</p>
              </div>
            )}

            <div>
              <span className="font-bold block mb-1 uppercase text-[10px] tracking-tighter opacity-40">{t.action}</span>
              <p className="text-justify">{project.description[lang]}</p>
            </div>
            
          </div>
        </div>

        {project.videoUrl !== '#' && (
          <motion.a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 text-xs uppercase tracking-widest font-bold group"
          >
            {t.playReel} <ArrowRight size={16} className="group-hover:text-accent transition-colors" />
          </motion.a>
        )}

        {project.links?.map((link: { label: Record<string, string>; url: string }) => (
          <motion.a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 text-xs uppercase tracking-widest font-bold group"
          >
            [ {link.label[lang]} ] <ArrowRight size={16} className="group-hover:text-accent transition-colors" />
          </motion.a>
        ))}

        {project.documentationUrl && (
          <motion.button
            whileHover={{ x: 10 }}
            onClick={() => setShowDoc(true)}
            className="flex items-center gap-4 text-xs uppercase tracking-widest font-bold group cursor-pointer"
          >
            [ {t.productionFolder} ] <FileText size={16} className="group-hover:text-accent transition-colors" />
          </motion.button>
        )}
      </div>

      {/* Visuals Column */}
      <div className="lg:col-span-7 space-y-8">
        {/* Video Embed - Desktop Only */}
        <div className="hidden lg:block">
          <div
            className="relative overflow-hidden bg-bg"
            style={{ aspectRatio: '16/9' }}
          >
            {embedUrl && videoId ? (
              <YouTubeFacade embedUrl={embedUrl} videoId={videoId} title={project.title} />
            ) : videoImage ? (
              <div className="relative w-full h-full">
                <LazyImage
                  src={videoImage}
                  className="w-full h-full cursor-pointer"
                  imgClassName="hover:grayscale-0"
                  alt={`${project.title} video`}
                  onClick={() => onImageClick(project.images, 0)}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-bg-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => onImageClick(project.images, 0)}
                >
                  <Play size={32} className="text-title fill-title" />
                </div>
              </div>
            ) : (
              <CoverLinkCard href={primaryLink} title={project.title} label={primaryLabel} isVideo={hasVideo} />
            )}
          </div>
        </div>

        {/* Other Photos - Always here (Bottom on mobile) */}
        <div className="grid grid-cols-2 gap-8">
          {otherImages.map((img: string, i: number) => (
            <div
              key={i}
              className="relative cursor-pointer col-span-1"
              onClick={() => onImageClick(project.images, embedUrl ? i : i + 1)}
            >
              <LazyImage
                src={img}
                className="w-full"
                imgClassName="hover:grayscale-0"
                naturalHeight
                alt={`${project.title} still ${i}`}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Behind The Scenes - Full width row */}
      {project.behindTheScenes && project.behindTheScenes.length > 0 && (
        <div className="lg:col-span-12 space-y-4">
          <button
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold mt-2 hover:text-accent transition-all duration-300 hover:opacity-80 hover:scale-105 origin-left cursor-pointer"
            onClick={() => setShowBTS(!showBTS)}
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${showBTS ? 'rotate-180' : 'rotate-0'}`}
            />
            {t.behindTheScenes}
          </button>
          {showBTS && (
            /* UPDATED SECTION: Masonry layout with Max-Height constraint */
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {project.behindTheScenes.map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative cursor-pointer break-inside-avoid overflow-hidden"
                  onClick={() => onImageClick(project.behindTheScenes, i)}
                >
                  <LazyImage
                    src={img}
                    className="w-full"
                    /* Added max-h-[450px] and object-cover to prevent portrait images from hanging too far down */
                    imgClassName="w-full h-auto max-h-[450px] object-cover hover:grayscale-0"
                    alt={`${project.title} BTS ${i}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Documentation PDF Modal */}
      {showDoc && project.documentationUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-bg-95 flex flex-col"
          onClick={() => setShowDoc(false)}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-title-20 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-title opacity-60">{t.productionFolder}</p>
            <button
              onClick={() => setShowDoc(false)}
              className="text-title opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Close document viewer"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={project.documentationUrl}
              title={`${project.title} - ${t.productionFolder}`}
              className="w-full h-full border-0"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};