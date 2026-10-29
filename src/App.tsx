import { useState, type ReactNode } from 'react'
import { Menu, X, Zap, Landmark, MapPin, Users, Share2, Sun, Check } from 'lucide-react'

/* ---------- Constants ---------- */

const LIGHT = '#ECEFF4' // Nord6, main background
const TINT = '#D9E5E9' // Nord7 teal (#8FBCBB) at 20% over Nord6: the subtle tinted background
const DARK_WAVE = '#2E3440' // Nord0
const DARK_WAVE_ALT = '#3B4252' // Nord1
const wrap = 'mx-auto w-full max-w-[1100px] px-6'

/* ---------- Content ---------- */

const navLinks = [
  { label: 'The Issue', href: '#issue' },
  { label: 'The Philippines', href: '#philippines' },
  { label: 'Take Action', href: '#action' },
  { label: 'Sources', href: '#sources' },
]

// To add a photo: put the file in public/images/, set `src`, and fill `credit` with the verified
// author, source and licence (e.g. 'Photo: Name / Wikimedia Commons, CC BY-SA 4.0').
type Img = { src?: string; alt: string; need: string; credit?: string }
const images: Record<'hero' | 'heat' | 'coast' | 'ph' | 'community', Img> = {
  hero: { src: '/images/open-ocean.jpeg', alt: 'A coastline meeting the open ocean', need: 'A wide, calm coastline or open ocean (landscape, ~21:9 crop).' },
  heat: { src: '/images/el-nino.jpg', alt: 'A dry, heat-affected landscape', need: 'A real heat-affected landscape, such as cracked dry ground.' },
  coast: { src: '/images/shoreline-erosion.jpg', alt: 'A shoreline with signs of erosion', need: 'A wide shoreline showing erosion or a seawall (not a single flood photo).' },
  ph: { src: '/images/shoreline-settlement.jpg', alt: 'A coastal community in the Philippines', need: 'A genuine photo of a Philippine coastal community or shoreline.' },
  community: { src: '/images/naga-tree-planting.jpg', alt: 'A community tree-growing activity in San Felipe, Naga City', need: 'A credited photograph of the San Felipe community climate action or a Naga City watershed landscape.' },
}

type Scenario = { at: number; title: string; intro: string; rows: { k: string; v: string }[] }
const scenarios: Scenario[] = [
  { at: 1.5, title: 'Around +1.5°C', intro: 'Close to the lower Paris Agreement goal. The world has already warmed by about 1.1°C (IPCC AR6, 2011–2020 average).',
    rows: [
      { k: 'Extreme heat', v: 'Hot extremes are more frequent and intense than today in most regions.' },
      { k: 'Heavy rainfall', v: 'Heavy rainfall events intensify in most regions, though changes differ from place to place.' },
      { k: 'Ecosystems', v: 'Warm-water coral reefs face a high risk of decline, and some species begin shifting where they live.' },
      { k: 'Sea level', v: 'The ocean keeps rising as glaciers and ice sheets lose mass and seawater warms.' },
    ] },
  { at: 2.0, title: 'Around +2.0°C', intro: 'The upper limit of the Paris Agreement goal. Half a degree more than +1.5°C changes the risks in many areas.',
    rows: [
      { k: 'Extreme heat', v: 'Heat that was once rare becomes much more common, and more regions face heat that is hard on health, crops and outdoor work.' },
      { k: 'Heavy rainfall', v: 'Heavy rain intensifies further, while some regions become drier and more drought-prone.' },
      { k: 'Ecosystems', v: 'Coral reef loss and ecosystem stress increase, and more species lose suitable habitat.' },
      { k: 'Sea level', v: 'Each fraction of a degree adds to long-term sea-level rise. The gap between +1.5°C and +2.0°C matters most over centuries.' },
    ] },
  { at: 3.0, title: 'Around +3.0°C', intro: 'A level reached under higher-emissions pathways. Limits to adaptation become more common.',
    rows: [
      { k: 'Extreme heat', v: 'Dangerous heat becomes a regular feature in many regions, and adapting gets harder for people and ecosystems.' },
      { k: 'Heavy rainfall', v: 'Swings between very wet and very dry conditions grow larger in many regions.' },
      { k: 'Ecosystems', v: 'Widespread ecosystem disruption, with many species and habitats unable to adjust fast enough.' },
      { k: 'Sea level', v: 'The sea-level rise already set in motion becomes large, and ice-sheet loss increasingly reshapes coastlines over centuries.' },
    ] },
  { at: 4.0, title: 'Around +4.0°C', intro: 'A high-end scenario. Scientists have less certainty about some outcomes, and risks are severe.',
    rows: [
      { k: 'Extreme heat', v: 'Heat extremes go far beyond anything in the historical record in many places.' },
      { k: 'Heavy rainfall', v: 'Both heavy rain and drought intensify further, with large regional differences.' },
      { k: 'Ecosystems', v: 'Severe and in some cases irreversible loss of ecosystems.' },
      { k: 'Sea level', v: 'The risk of rapid ice-sheet loss rises, though how fast it could happen is deeply uncertain. Sea level would keep rising for centuries.' },
    ] },
]
const pickScenario = (t: number) => (t < 1.75 ? scenarios[0] : t < 2.5 ? scenarios[1] : t < 3.5 ? scenarios[2] : scenarios[3])

const actions = [
  { icon: Landmark, text: 'Support evidence-based climate policies.', href: 'https://www.ipcc.ch/report/ar6/wg3/', label: 'IPCC mitigation report' },
  { icon: Zap, text: 'Reduce avoidable energy consumption.', href: 'https://www.un.org/en/actnow', label: 'UN ActNow' },
  { icon: MapPin, text: 'Check your barangay or city climate-risk information and preparedness plans.', href: 'https://www.pagasa.dost.gov.ph/', label: 'PAGASA' },
  { icon: Users, text: 'Join a local coastal, river, mangrove, or disaster-preparedness initiative.', href: 'https://climate.gov.ph/', label: 'Climate Change Commission' },
  { icon: Share2, text: 'Share reliable climate information with your family, school, or community group.', href: 'https://science.nasa.gov/climate-change/', label: 'NASA Climate Change' },
]

const sources = [
  { group: 'Global warming', items: [
    { label: 'NASA — Evidence: how do we know climate change is real?', href: 'https://science.nasa.gov/climate-change/evidence/' },
    { label: 'UN — Causes and effects of climate change', href: 'https://www.un.org/en/climatechange/science/causes-effects-climate-change' },
    { label: 'IPCC — Sixth Assessment Report, Working Group I (the physical science basis)', href: 'https://www.ipcc.ch/report/ar6/wg1/' },
    { label: 'IPCC — Special Report on Global Warming of 1.5°C', href: 'https://www.ipcc.ch/sr15/' },
  ]},
  { group: 'Sea-level rise', items: [
    { label: 'NASA Sea Level Change portal', href: 'https://sealevel.nasa.gov/' },
    { label: 'IPCC — Special Report on the Ocean and Cryosphere in a Changing Climate', href: 'https://www.ipcc.ch/srocc/' },
  ]},
  { group: 'The Philippines', items: [
    { label: 'PAGASA — Philippine Atmospheric, Geophysical and Astronomical Services Administration', href: 'https://www.pagasa.dost.gov.ph/' },
    { label: 'NASA Climate Change (general reference)', href: 'https://science.nasa.gov/climate-change/' },
  ]},
  { group: 'Community example', items: [
    { label: 'Climate Change Commission — San Felipe, Naga community climate action', href: 'https://climate.gov.ph/news/1161' },
    { label: 'World Bank — Philippines Climate Change Knowledge Portal', href: 'https://climateknowledgeportal.worldbank.org/country/philippines' },
    { label: 'Climate Change Commission — Philippines', href: 'https://climate.gov.ph/' },
  ]},
]

/* ---------- Reusable pieces ---------- */

function Figure({ img, caption, ratio = 'aspect-[4/3]' }: { img: Img; caption?: string; ratio?: string }) {
  const text = [caption, img.credit].filter(Boolean).join(' ')
  return (
    <figure>
      {img.src ? (
        <img src={img.src} alt={img.alt} loading="lazy" className={`w-full rounded-xl object-cover ${ratio}`} />
      ) : (
        <div role="img" aria-label={`Photo placeholder: ${img.need}`}
          className={`flex ${ratio} items-center justify-center border border-nord4 bg-nord5 p-6 text-center text-sm text-nord3`}>
          Photo to add: {img.need}
        </div>
      )}
      {text && <figcaption className="mt-2 text-sm text-nord3">{text}</figcaption>}
    </figure>
  )
}

/* A broad Nord-style boundary between light and dark panels. */
function Wave({ from, tone }: { from: string; tone: string }) {
  const crest = 'M0 34 C 180 8, 390 4, 600 26 S 990 62, 1200 34 S 1350 16, 1440 24'
  return (
    <div aria-hidden="true" className="overflow-hidden leading-[0]" style={{ background: from }}>
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="block h-12 w-full md:h-20">
        <path d={`${crest} L1440 72 L0 72 Z`} fill={tone} />
      </svg>
    </div>
  )
}

function H2({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) {
  return <h2 id={id} className={`font-serif text-2xl font-semibold uppercase tracking-wide md:text-3xl ${className}`}>{children}</h2>
}

function CurrentLines() {
  const lines = [
    { d: 'M0 44 C 110 8, 205 78, 325 40 S 540 8, 680 44 S 895 78, 1040 36 S 1240 12, 1440 46', className: 'current-line current-line-primary' },
    { d: 'M0 74 C 125 38, 210 102, 350 70 S 565 35, 715 74 S 920 106, 1070 68 S 1260 42, 1440 76', className: 'current-line current-line-secondary' },
    { d: 'M0 104 C 130 72, 235 130, 370 102 S 575 72, 730 104 S 930 136, 1085 100 S 1270 78, 1440 108', className: 'current-line current-line-tertiary' },
  ]

  return (
    <div className="current-lines" aria-hidden="true">
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
        {lines.map((line) => <path key={line.className} d={line.d} className={line.className} />)}
      </svg>
    </div>
  )
}

const sectionPad = 'py-10 md:py-14'

/* ---------- Temperature slider ---------- */

function TemperatureSlider() {
  const [temp, setTemp] = useState(2.0)
  const s = pickScenario(temp)
  const pct = ((temp - 1) / 3) * 100
  const label = `+${temp.toFixed(1)}°C`
  const heat = (temp - 1) / 3
  const sunColor = heat < 0.34 ? '#EBCB8B' : heat < 0.67 ? '#D08770' : '#BF616A'
  const sunGlow = 16 + heat * 28

  return (
    <section id="slider" aria-labelledby="slider-title" className={`${sectionPad}`}>
      <style>{`
        .temp-range{-webkit-appearance:none;appearance:none;width:100%;height:24px;background:transparent;cursor:pointer}
        .temp-range::-webkit-slider-runnable-track{height:4px;background:linear-gradient(to right,#5E81AC var(--pct),#D8DEE9 var(--pct))}
        .temp-range::-moz-range-track{height:4px;background:#D8DEE9}
        .temp-range::-moz-range-progress{height:4px;background:#5E81AC}
        .temp-range::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;margin-top:-8px;border-radius:50%;background:#ECEFF4;border:2px solid #5E81AC}
        .temp-range::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#ECEFF4;border:2px solid #5E81AC}
      `}</style>
      <div className={wrap}>
        <H2 id="slider-title" className="text-center">A few degrees can change a lot.</H2>
        <p className="mx-auto mt-4 max-w-[62ch] text-center text-nord1">
          Move the slider to explore warming levels, measured against the 1850–1900 pre-industrial average. These are illustrative scenarios, not a forecast for any particular year.
        </p>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-stretch md:gap-14">
          <div className="flex min-h-[520px] flex-col justify-center text-center md:h-[560px] md:min-h-0 md:-translate-y-6 md:text-left">
            <div className="mb-6 flex justify-center">
              <div
                role="img"
                aria-label={`Warming intensity: ${label}`}
                className="rounded-full p-6 transition-[background,color,filter,transform] duration-500 ease-out"
                style={{
                  color: sunColor,
                  filter: `drop-shadow(0 0 ${sunGlow}px ${sunColor})`,
                  background: `radial-gradient(circle, ${sunColor}33 0%, transparent 70%)`,
                  transform: `scale(${1 + heat * 0.12})`,
                }}
              >
                <Sun size={92} strokeWidth={1.25} />
              </div>
            </div>
            <div className="flex items-baseline justify-center gap-3 md:justify-start">
              <output htmlFor="temp" className="font-serif text-5xl font-semibold md:text-6xl">{label}</output>
              <span className="text-sm text-nord3">above 1850–1900</span>
            </div>
            <label htmlFor="temp" className="mt-6 block text-sm text-nord3">Global warming level</label>
            <input id="temp" type="range" min={1} max={4} step={0.1} value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              aria-valuetext={`${label} above the 1850 to 1900 average`}
              className="temp-range mt-2" style={{ ['--pct' as string]: `${pct}%` }} />
            <div className="relative mx-[10px] mt-1 h-10 text-xs text-nord3" aria-hidden="true">
              {scenarios.map((sc) => (
                <button key={sc.at} type="button" tabIndex={-1} onClick={() => setTemp(sc.at)}
                  className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${((sc.at - 1) / 3) * 100}%` }}>
                  <span className="h-2 w-px bg-nord3" />
                  <span className={sc.at === s.at ? 'font-semibold text-nord0' : ''}>+{sc.at.toFixed(1)}°</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-justify text-sm text-nord3">
              Impacts grow gradually, not in steps at the markers. Global averages hide regional differences. Sea level responds slowly and keeps rising for centuries after temperatures level off.
            </p>
          </div>

          <div aria-live="polite" className="min-h-[520px] md:h-[560px]">
            <h3 className="font-serif text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-justify text-nord1">{s.intro}</p>
            <dl className="mt-4 divide-y divide-nord4 border-y border-nord4 text-nord1">
              {s.rows.map((r) => (
                <div key={r.k} className="grid gap-1 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
                  <dt className="text-sm font-medium text-nord0">{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-justify text-sm text-nord3">
              Based on qualitative findings in IPCC <a className="link" href="https://www.ipcc.ch/report/ar6/wg1/" target="_blank" rel="noopener noreferrer">AR6</a> and the <a className="link" href="https://www.ipcc.ch/sr15/" target="_blank" rel="noopener noreferrer">1.5°C Special Report</a>. No figures are quoted.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Page ---------- */

export default function App() {
  const [open, setOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-nord6 focus:p-2">Skip to content</a>

      {/* Navigation */}
      <header className="sticky top-0 z-10 border-b border-nord4 bg-nord6">
        <nav aria-label="Main" className={`${wrap} flex h-14 items-center justify-between`}>
          <a href="#top" className="font-serif text-base font-semibold tracking-widest">SEACHANGE</a>
          <ul className="hidden gap-8 text-sm md:flex">
            {navLinks.map((l) => (
              <li key={l.href}><a href={l.href} className="text-nord3 underline-offset-4 hover:text-nord0 hover:underline">{l.label}</a></li>
            ))}
          </ul>
          <button className="md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </nav>
        {open && (
          <ul id="mobile-menu" className="border-t border-nord4 px-6 py-2 md:hidden">
            {navLinks.map((l) => (
              <li key={l.href}><a href={l.href} onClick={close} className="block py-3 text-nord1">{l.label}</a></li>
            ))}
          </ul>
        )}
      </header>

      <main id="main">
        {/* Hero: headline and intro side by side, then one wide photograph */}
        <section id="top" className="pt-10 md:pt-14">
          <div className={wrap}>
            <div className="grid items-end gap-6 md:grid-cols-[3fr_2fr] md:gap-14">
              <div>
                <p className="text-sm uppercase tracking-widest text-nord3">Climate change &amp; our future</p>
                <h1 className="mt-3 font-serif text-4xl font-semibold uppercase leading-tight md:text-6xl">A hotter planet.<br />A higher sea.</h1>
              </div>
              <div>
                <p className="text-lg text-nord1">Rising temperatures are changing our oceans, reshaping our coastlines, and threatening communities around the world.</p>
                <a href="#issue" className="mt-5 inline-block border border-nord0 px-5 py-2.5 text-sm hover:bg-nord0 hover:text-nord6">Understand the Issue</a>
              </div>
            </div>
            <div className="mt-8 md:mt-10"><Figure img={images.hero} ratio="aspect-[16/9] md:aspect-[21/9]" /></div>
          </div>
          <div className="h-10 md:h-14" />
        </section>

        {/* The rising heat: image left, text right */}
        <section id="issue" className={`border-t border-nord4 ${sectionPad}`}>
          <div className={`${wrap} grid items-center gap-8 md:grid-cols-2 md:gap-14`}>
            <Figure img={images.heat} />
            <div>
              <H2>The world is getting warmer</H2>
              <div className="mt-5 max-w-[62ch] space-y-4 text-justify text-nord1">
                <p>Earth&rsquo;s average surface temperature has risen over the past century and a half. The main cause is human activity: burning coal, oil and gas, along with deforestation and some farming practices, releases greenhouse gases such as carbon dioxide and methane. These gases trap heat that would otherwise escape to space.</p>
                <p>A warmer climate makes heat extremes more frequent or more intense in many regions. That does not mean every heatwave or storm is caused by climate change. Scientists study how much warming has changed the odds of particular events, and the picture differs from place to place.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Heat to rising seas: tinted, full width */}
        <Wave from={LIGHT} tone={DARK_WAVE} />
        <section className={`${sectionPad} on-dark`} style={{ background: DARK_WAVE }}>
          <div className={wrap}>
            <H2 className="text-center">Why warmer means higher</H2>
            <p className="mx-auto mt-5 max-w-[62ch] text-center text-nord4">The ocean absorbs much of the extra heat in the climate system. That heat raises sea level in two main ways.</p>
            <div className="mt-8 grid gap-8 border-t border-nord3 pt-8 md:grid-cols-2 md:gap-14">
              <div>
                <h3 className="font-serif text-xl font-semibold">Thermal expansion</h3>
                <p className="mt-2 max-w-[56ch] text-justify text-nord4">Water expands as it warms. Even without any new water entering the ocean, a warmer ocean takes up more space, and the surface rises.</p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Melting land ice</h3>
                <p className="mt-2 max-w-[56ch] text-justify text-nord4">Glaciers and ice sheets sit on land. When they melt, the water flows into the ocean and adds to its volume. Floating sea ice is different: when it melts it has a much smaller direct effect on sea level.</p>
              </div>
            </div>
          </div>
        </section>
        <Wave from={DARK_WAVE} tone={LIGHT} />

        {/* Interactive feature */}
        <TemperatureSlider />

        {/* Consequences: wide photo, then two columns of text */}
        <section className={`border-t border-nord4 ${sectionPad}`}>
          <div className={wrap}>
            <Figure img={images.coast} ratio="aspect-[16/9] md:aspect-[21/9]" caption="Long-term sea-level rise is separate from any single flood." />
            <div className="mt-8 grid gap-6 md:grid-cols-[2fr_3fr] md:gap-14">
              <div>
                <H2>When the water rises</H2>
                <CurrentLines />
              </div>
              <div className="max-w-[62ch] space-y-4 text-justify text-nord1">
                <p>Higher seas raise the baseline that tides and storms start from. Over time this can mean more frequent coastal flooding, faster shoreline erosion, saltwater moving into freshwater supplies and farmland, and growing risk for roads, ports, homes and coastal ecosystems.</p>
                <p>It helps to keep two things apart. Sea-level rise is a slow, long-term trend. An individual flood also depends on storms, tides, rainfall, drainage and sometimes land subsidence. Sea-level rise can make such floods worse, but one flood alone does not prove it.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Philippines: tinted, text left and image right */}
        <Wave from={LIGHT} tone={DARK_WAVE_ALT} />
        <section id="philippines" className={`${sectionPad} on-dark`} style={{ background: DARK_WAVE_ALT }}>
          <div className={`${wrap} grid items-center gap-8 md:grid-cols-2 md:gap-14`}>
            <div>
              <H2>An island nation at risk</H2>
              <div className="mt-5 max-w-[62ch] space-y-4 text-justify text-nord4">
                <p>The Philippines has thousands of islands and a very long coastline, and many people live and work close to the sea. Fishing, farming, ports and coastal towns all depend on the shore staying where it is.</p>
                <p>Sea-level rise adds to existing coastal pressures: flooding, erosion, and saltwater reaching groundwater and fields. Vulnerability is not the same everywhere. Land subsidence, tides, typhoons and local drainage can make the effective rise greater in some places than the global average.</p>
                <p>For official Philippine climate information, start with <a className="link" href="https://www.pagasa.dost.gov.ph/">PAGASA</a>.</p>
              </div>
            </div>
            <Figure img={images.ph} />
          </div>
        </section>
        <Wave from={DARK_WAVE_ALT} tone={TINT} />

        {/* Community example: a specific place and shared local action */}
        <section id="community" className={`border-t border-nord4 ${sectionPad}`} style={{ background: TINT }}>
          <div className={wrap}>
            <div className="grid gap-8 md:grid-cols-[2fr_3fr] md:gap-14">
              <div>
                <p className="text-sm uppercase tracking-widest text-nord3">A community example</p>
                <H2 className="mt-2">San Felipe, Naga City</H2>
                <div className="mt-8 flex justify-center">
                  <Figure img={images.community} ratio="aspect-[4/3] w-full max-w-[24rem]" />
                </div>
              </div>
              <div className="max-w-[62ch] space-y-4 text-justify text-nord1">
                <p>In San Felipe, Naga City, community members, youth leaders, and students joined the City Government of Naga and the Climate Change Commission in a science-based tree-growing activity. The effort included native narra trees, bamboo, fruit-bearing trees, and vetiver grass to support forest restoration, watershed protection, soil stability, and livelihoods.</p>
                <p>Naga sits within the Bicol River Basin and at the foot of Mount Isarog. That makes local restoration a shared responsibility: what happens in the watershed can affect water flow, erosion, and downstream communities. The project brought together about 100 community members and planted 100 narra seedlings and 160 vetiver grass saplings.</p>
                <p className="border-l-2 border-nord7 pl-4 font-serif text-lg text-nord0">&ldquo;Climate action cannot end with a plan. It must be translated into decisions, investments, and actions that communities can see and experience on the ground.&rdquo;</p>
                <p className="text-sm text-nord3">— Robert E. A. Borje, Climate Change Commission Vice Chairperson and Executive Director, quoted in the Commission&rsquo;s October 2026 report.</p>
                <p className="text-sm text-nord3">This is a documented example of collective local action. It is not presented as a quotation from a resident; the quotation is attributed to the national climate agency&rsquo;s official report.</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <a className="link" href="https://climate.gov.ph/news/1161" target="_blank" rel="noopener noreferrer">Climate Change Commission report</a>
                  <a className="link" href="https://climateknowledgeportal.worldbank.org/country/philippines" target="_blank" rel="noopener noreferrer">World Bank climate profile</a>
                  <a className="link" href="https://www.pagasa.dost.gov.ph/" target="_blank" rel="noopener noreferrer">PAGASA climate information</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Wave from={TINT} tone={LIGHT} />

        {/* Take action */}
        <section id="action" className={sectionPad}>
          <div className={wrap}>
            <H2 className="text-center">Our future is still ours to shape</H2>
            <ul className="mt-8 divide-y divide-nord4 border-y border-nord4">
              {actions.map(({ icon: Icon, text, href, label }) => (
                <li key={text} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:gap-4">
                  <span className="flex flex-1 items-start gap-4"><Icon size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-nord10" aria-hidden="true" />{text}</span>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="link pl-9 text-sm sm:pl-0">{label}<span className="sr-only"> (opens in a new tab)</span></a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sources */}
        <Wave from={LIGHT} tone="#E5E9F0" />
        <section id="sources" className={`border-t border-nord4 bg-nord5 ${sectionPad}`}>
          <div className={wrap}>
            <H2 className="text-center">Sources &amp; further reading</H2>
            <p className="mx-auto mt-5 max-w-[62ch] text-center text-nord1">The text on this page is a plain-language explanation. It does not quote statistics, apart from the roughly 1.1°C of warming to date reported by the IPCC. For figures, projections and dates, read the original sources below.</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {sources.map((g, index) => (
                <div key={g.group} className={index === sources.length - 1 ? 'md:col-start-2' : ''}>
                  <h3 className="font-serif text-lg font-semibold">{g.group}</h3>
                  <ul className="mt-3 space-y-3 text-sm">
                    {g.items.map((s) => (
                      <li key={s.href + s.label}><a className="link" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Closing + footer */}
      <Wave from="#E5E9F0" tone={DARK_WAVE} />
      <footer className="on-dark bg-nord0 text-nord6">
        <div className={`${wrap} grid gap-10 py-12 md:grid-cols-[3fr_2fr] md:items-center md:gap-14 md:py-16`}>
          <div>
            <h2 className="max-w-[20ch] font-serif text-3xl font-semibold uppercase leading-tight md:text-4xl">The future is a shared responsibility.</h2>
            <p className="mt-5 max-w-[56ch] text-nord4">No single person can slow warming or hold back the sea. Informed choices, made by many people and institutions together, can. Start with what you can learn, say and change near you.</p>
          </div>
          <form
              className="max-w-[38rem] border-t border-nord3 pt-6 md:self-center md:border-t-0 md:border-l md:pl-8 md:pt-0"
              onSubmit={(event) => {
                event.preventDefault()
                setSubscribed(true)
              }}
            >
              <label htmlFor="newsletter-email" className="font-serif text-lg text-nord6">Stay connected to climate action</label>
              <p className="mt-1 text-sm text-nord4">Get occasional updates and practical ways to help your community.</p>
              {subscribed ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-nord8" role="status">
                  <Check size={16} aria-hidden="true" /> You&rsquo;re on the list. Thank you for joining.
                </p>
              ) : (
                <div className="mt-4 flex max-w-[32rem] flex-col gap-2 sm:flex-row">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="min-w-0 flex-1 border border-nord3 bg-transparent px-4 py-2.5 text-sm text-nord6 placeholder:text-nord4 focus:border-nord8 focus:outline-none"
                  />
                  <button type="submit" className="border border-nord8 px-5 py-2.5 text-sm text-nord6 transition-colors hover:bg-nord8 hover:text-nord0">Subscribe</button>
                </div>
              )}
          </form>
        </div>
        <div className="border-t border-nord3">
          <div className={`${wrap} flex flex-col gap-3 py-6 text-sm text-nord4 sm:flex-row sm:items-center sm:justify-between`}>
            <span className="font-serif tracking-widest">SEACHANGE</span>
            <ul className="flex flex-wrap gap-6">
              {navLinks.map((l) => (<li key={l.href}><a href={l.href} className="underline-offset-4 hover:underline">{l.label}</a></li>))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}