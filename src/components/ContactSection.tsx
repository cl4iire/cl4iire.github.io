import type { Translations } from "../data/portfolio";

const label = "text-[13px] font-bold tracking-[0.04em] uppercase text-muted";

export function ContactSection({ t, onOpenCv, onOpenProject }: { t: Translations; onOpenCv: () => void; onOpenProject: () => void }) {
  return (
    <footer id="contact" aria-labelledby="ct-t" className="scroll-mt-16 desk:scroll-mt-0 pt-[clamp(80px,10vw,140px)] px-[clamp(20px,4vw,64px)] pb-10">
      <h2 id="ct-t" className="m-0 mb-3 text-[15px] font-bold tracking-[0.04em] uppercase">
        {t.contact}
      </h2>
      <a
        href="mailto:claire.blaborde@gmail.com"
        className="block text-[clamp(36px,6.6vw,108px)] font-extrabold leading-[0.95] tracking-[-0.045em] no-underline text-accent break-words hover:text-ink"
      >
        claire.blaborde
        <br />
        @gmail.com
      </a>
      <div className="flex flex-wrap justify-between items-end gap-x-10 gap-y-7 mt-12 pt-7 border-t-2 border-ink">
        <dl className="m-0 flex flex-wrap gap-x-12 gap-y-5 text-[19px]">
          <div>
            <dt className={label}>{t.phone}</dt>
            <dd className="mt-0.5 mb-0 mx-0 font-semibold">
              <a href="tel:+33633997906" className="no-underline inline-flex items-center min-h-[44px] hover:text-accent">
                06 33 99 79 06
              </a>
            </dd>
          </div>
          <div>
            <dt className={label}>Instagram</dt>
            <dd className="mt-0.5 mb-0 mx-0 font-semibold">
              <a
                href="https://www.instagram.com/kll4er"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline inline-flex items-center min-h-[44px] hover:text-accent"
              >
                @kll4er
              </a>
            </dd>
          </div>
          <div>
            <dt className={label}>LinkedIn</dt>
            <dd className="mt-0.5 mb-0 mx-0 font-semibold">
              <a
                href="https://www.linkedin.com/in/claire-buhaceanu-laborde-51a74738b/"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline inline-flex items-center min-h-[44px] hover:text-accent"
              >
                Claire Buhaceanu Laborde
              </a>
            </dd>
          </div>
          <div>
            <dt className={label}>{t.base}</dt>
            <dd className="mt-0.5 mb-0 mx-0 font-semibold min-h-[44px] flex items-center">{t.baseValue}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onOpenCv}
            className="min-h-[52px] px-6 rounded-full bg-ink text-rose border-0 text-[17px] font-bold cursor-pointer hover:bg-accent"
          >
            {t.seeCv}
          </button>
          <button
            type="button"
            onClick={onOpenProject}
            className="min-h-[52px] px-6 rounded-full bg-transparent text-ink border-[1.5px] border-ink text-[17px] font-bold cursor-pointer hover:bg-ink hover:text-rose"
          >
            {t.projectShort}
          </button>
        </div>
      </div>
      <p className="mt-12 mb-0 text-sm text-muted">{t.rights}</p>
    </footer>
  );
}
