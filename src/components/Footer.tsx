import { Mail, MapPin, FileText, Instagram } from "lucide-react";
import { LazyImage } from "./LazyImage";
import clairePortrait from '../assets/about/claireAbout.webp';

interface FooterProps {
  t: any;
  onCvOpen: () => void;
  onImageClick: (images: string[], index: number) => void;
}

export const Footer = ({ t, onCvOpen, onImageClick }: FooterProps) => {
  return (
    <>
      <div id="about" />
      <footer id="contact" className="bg-bg text-text py-24 px-6 border-t border-title-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-center">

          {/* Photo */}
          <div className="relative max-w-xs mx-auto md:mx-0">
            <div className="p-4 border-4 border-title shadow-xl">
              <LazyImage
                src={clairePortrait}
                className="w-full cursor-pointer"
                alt="Claire"
                naturalHeight
                onClick={() => onImageClick([clairePortrait], 0)}
              />
              <p className="mt-4 text-[10px] text-center opacity-40 uppercase tracking-widest">Subject: Claire B.L.</p>
            </div>
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-accent" />
            <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-accent" />
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <p className="opacity-40 max-w-xs font-mono text-xs">
              // {t.status} <br />
              // {t.location}
            </p>
            <div className="space-y-4">
              <a href="mailto:claire.blaborde@gmail.com" className="flex items-center gap-4 hover:text-accent transition-colors">
                <Mail size={20} /> claire.blaborde@gmail.com
              </a>
              <div className="flex items-center gap-4">
                <MapPin size={20} /> {t.locationLine ?? 'Based in France / Open to Travel'}
              </div>
            </div>
          </div>

          {/* Links + copyright */}
          <div className="flex flex-col justify-between items-start md:items-end gap-12">
            <div className="flex gap-6">
              <button onClick={onCvOpen} aria-label="Voir le CV" className="w-12 h-12 rounded-full border border-title-20 flex items-center justify-center hover:bg-title hover:text-bg transition-all cursor-pointer">
                <FileText size={20} aria-hidden="true" />
              </button>
              <a href="https://www.instagram.com/kll4er?igsh=MWVua3NwYTlhcHJ2cw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full border border-title-20 flex items-center justify-center hover:bg-title hover:text-bg transition-all">
                <Instagram size={20} aria-hidden="true" />
              </a>
            </div>
            <p className="text-[10px] opacity-20">© 2026 - {t.rights}</p>
          </div>

        </div>
      </footer>
    </>
  );
};
