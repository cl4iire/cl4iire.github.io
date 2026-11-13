import type { Translations } from "../data/portfolio";

const cardTitle = "m-0 mb-3 text-[15px] font-bold tracking-[0.04em] uppercase";

export function AboutSection({ t }: { t: Translations }) {
  return (
    <section id="apropos" aria-labelledby="ap-t" className="pt-[clamp(72px,9vw,128px)] px-[clamp(20px,4vw,64px)]">
      <div className="flex flex-wrap gap-x-[clamp(32px,5vw,80px)] gap-y-10">
        <div className="flex-[1.3_1_440px] min-w-0">
          <h2 id="ap-t" className="m-0 mb-6 text-[15px] font-bold tracking-[0.04em] uppercase">
            {t.about}
          </h2>
          <p className="m-0 mb-6 text-[clamp(28px,2.8vw,42px)] font-semibold leading-[1.18] tracking-[-0.02em]">{t.aboutLead}</p>
          <p className="m-0 text-xl max-w-[58ch]">{t.aboutBody}</p>
        </div>
        <ul className="flex-[1_1_340px] min-w-0 flex flex-col gap-3.5 list-none m-0 p-0">
          {t.education.map((e) => (
            <li key={e.school} className="flex gap-4 px-5 py-[18px] bg-white rounded-2xl">
              <span className="shrink-0 min-w-[92px] text-[15px] font-bold text-accent">{e.years}</span>
              <span>
                <span className="block text-[19px] font-bold leading-[1.3]">{e.school}</span>
                <span className="block text-base text-muted">{e.diploma}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5 mt-3.5">
        <div className="p-[22px] bg-ink text-rose rounded-2xl">
          <h3 className={`${cardTitle} text-pink`}>{t.tools}</h3>
          {/* One tool per line */}
          <ul className="list-none m-0 p-0 text-lg leading-[1.55]">
            {t.toolsList.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
        <div className="p-[22px] bg-white rounded-2xl">
          <h3 className={`${cardTitle} text-accent`}>{t.languages}</h3>
          {/* One language per line */}
          <ul className="list-none m-0 p-0 text-lg leading-[1.55] flex flex-col gap-2">
            {t.languagesList.map((l) => (
              <li key={l.name}>
                <b>{l.name}</b> {l.level}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-[22px] bg-pink text-ink rounded-2xl">
          <h3 className={cardTitle}>{t.skills}</h3>
          {/* One skill per line, bold, capitalised */}
          <ul className="list-none m-0 p-0 text-lg leading-[1.55] font-bold">
            {t.skillsList.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
