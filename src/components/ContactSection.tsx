import { DOCUMENTS, type Translations } from "../data/portfolio";

const label = "text-[13px] font-bold tracking-[0.04em] uppercase text-muted";
const linkClass = "no-underline inline-flex items-center min-h-[44px] hover:text-accent";

// "06 12 34 56 78" -> "+33612345678" (French numbers), other formats are kept as typed
const toTel = (phone: string) => {
  const digits = phone.replace(/[^\d+]/g, "");
  return /^0\d{9}$/.test(digits) ? `+33${digits.slice(1)}` : digits;
};

export function ContactSection({ t, onOpenCv, onOpenProject }: { t: Translations; onOpenCv: () => void; onOpenProject: () => void }) {
  // Each item can be hidden in Pages CMS ("Textes du site > Contact"); an empty field is hidden too
  const show = {
    email: t.afficher_email !== false && !!t.email?.trim(),
    phone: t.afficher_telephone !== false && !!t.telephone?.trim(),
    instagram: t.afficher_instagram !== false && !!t.instagram?.url?.trim(),
    linkedin: t.afficher_linkedin !== false && !!t.linkedin?.url?.trim(),
    base: t.afficher_base !== false && !!t.baseValue?.trim(),
  };
  const hasDetails = show.phone || show.instagram || show.linkedin || show.base;
  const hasButtons = DOCUMENTS.showCv || DOCUMENTS.showProject;

  return (
    <footer id="contact" aria-labelledby="ct-t" className="scroll-mt-16 desk:scroll-mt-0 pt-[clamp(80px,10vw,140px)] px-[clamp(20px,4vw,64px)] pb-10">
      <h2 id="ct-t" className="m-0 mb-3 text-[15px] font-bold tracking-[0.04em] uppercase">
        {t.contact}
      </h2>

      {show.email && (
        <a
          href={`mailto:${t.email}`}
          className="block text-[clamp(36px,6.6vw,108px)] font-extrabold leading-[0.95] tracking-[-0.045em] no-underline text-accent break-words hover:text-ink"
        >
          {/* Line break before the @ so the address fits on large type */}
          {t.email.split("@")[0]}
          <br />@{t.email.split("@")[1]}
        </a>
      )}

      {(hasDetails || hasButtons) && (
        <div className="flex flex-wrap justify-between items-end gap-x-10 gap-y-7 mt-12 pt-7 border-t-2 border-ink">
          <dl className="m-0 flex flex-wrap gap-x-12 gap-y-5 text-[19px]">
            {show.phone && (
              <div>
                <dt className={label}>{t.phone}</dt>
                <dd className="mt-0.5 mb-0 mx-0 font-semibold">
                  <a href={`tel:${toTel(t.telephone)}`} className={linkClass}>
                    {t.telephone}
                  </a>
                </dd>
              </div>
            )}
            {show.instagram && (
              <div>
                <dt className={label}>Instagram</dt>
                <dd className="mt-0.5 mb-0 mx-0 font-semibold">
                  <a href={t.instagram.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {t.instagram.pseudo}
                  </a>
                </dd>
              </div>
            )}
            {show.linkedin && (
              <div>
                <dt className={label}>LinkedIn</dt>
                <dd className="mt-0.5 mb-0 mx-0 font-semibold">
                  <a href={t.linkedin.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {t.linkedin.texte}
                  </a>
                </dd>
              </div>
            )}
            {show.base && (
              <div>
                <dt className={label}>{t.base}</dt>
                <dd className="mt-0.5 mb-0 mx-0 font-semibold min-h-[44px] flex items-center">{t.baseValue}</dd>
              </div>
            )}
          </dl>
          <div className="flex flex-wrap gap-2.5">
            {DOCUMENTS.showCv && (
              <button
                type="button"
                onClick={onOpenCv}
                className="min-h-[52px] px-6 rounded-full bg-ink text-rose border-0 text-[17px] font-bold cursor-pointer hover:bg-accent"
              >
                {t.seeCv}
              </button>
            )}
            {DOCUMENTS.showProject && (
              <button
                type="button"
                onClick={onOpenProject}
                className="min-h-[52px] px-6 rounded-full bg-transparent text-ink border-[1.5px] border-ink text-[17px] font-bold cursor-pointer hover:bg-ink hover:text-rose"
              >
                {t.projectShort}
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mt-12 mb-0 text-sm text-muted">{t.rights}</p>
    </footer>
  );
}
