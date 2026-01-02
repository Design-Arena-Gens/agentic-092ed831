import { LeadAgent } from "@/components/LeadAgent";

const highlights = [
  {
    label: "Monthly opt-ins",
    value: "4.7k",
    trend: "+26%",
  },
  {
    label: "Conversion rate",
    value: "38.4%",
    trend: "+9pts",
  },
  {
    label: "Avg. order size",
    value: "$212",
    trend: "+$34",
  },
];

const drops = [
  {
    title: "Monochrome drop",
    date: "Jun 24",
    status: "in production",
  },
  {
    title: "Phoebe Bridgers collab",
    date: "Jul 12",
    status: "pre-launch",
  },
  {
    title: "Late summer capsule",
    date: "Aug 3",
    status: "moodboarding",
  },
];

const proofPoints = [
  "Stylist-led onboarding with conversion scoring",
  "Automated lookbooks synced to Shopify tagging",
  "Granular audiences exported to Klaviyo + Meta Ads",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 bg-[radial-gradient(circle_at_top,_#f8f7f3_0%,_#f1efe9_45%,_#e7e5de_100%)] text-neutral-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-20 pt-10 lg:px-12">
        <header className="flex items-center justify-between gap-3 pb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Nova Wardrobe</p>
            <h1 className="pt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Lead concierge for emerging clothing brands
            </h1>
          </div>
          <a
            href="#lead-capture"
            className="hidden rounded-full border border-neutral-900/20 bg-white px-5 py-2 text-sm font-semibold text-neutral-900 shadow-md shadow-neutral-200 transition hover:-translate-y-0.5 hover:border-neutral-900/40 hover:shadow-lg hover:shadow-neutral-300/60 sm:inline-flex"
          >
            Launch agent
          </a>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,_1.15fr)_minmax(0,_0.85fr)]">
          <section className="flex flex-col gap-6">
            <div className="rounded-3xl border border-neutral-900/10 bg-white/70 p-8 shadow-xl shadow-neutral-200/60 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Style intelligence
              </p>
              <h2 className="pt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Turn curious scrollers into qualified looks-to-book leads
              </h2>
              <p className="pt-6 text-base leading-7 text-neutral-600">
                Luma maps shopper intent, style signals, and spend bands in under 60 seconds.
                Automate your 1:1 concierge without losing the human touch.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#lead-capture"
                  className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-400/60 transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  Book a walkthrough
                </a>
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  Live conversion data
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <article
                  key={highlight.label}
                  className="rounded-2xl border border-neutral-900/10 bg-white/70 p-5 shadow-lg shadow-neutral-200/60 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
                    {highlight.label}
                  </p>
                  <p className="pt-3 text-3xl font-semibold tracking-tight">{highlight.value}</p>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
                    {highlight.trend} this quarter
                  </p>
                </article>
              ))}
              <article className="rounded-2xl border border-neutral-900/10 bg-neutral-900/95 p-5 text-white shadow-lg shadow-neutral-200/60 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Upcoming drops</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {drops.map((drop) => (
                    <li
                      key={drop.title}
                      className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold">{drop.title}</p>
                        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                          {drop.status}
                        </p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-300">
                        {drop.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <article className="rounded-3xl border border-neutral-900/10 bg-white/80 p-7 shadow-lg shadow-neutral-200/60 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Signal routing</p>
              <h3 className="pt-3 text-lg font-semibold tracking-tight text-neutral-900">
                We plug straight into your growth stack
              </h3>
              <ul className="mt-5 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
                {proofPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 rounded-xl border border-neutral-900/10 bg-white/70 px-3 py-3"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-neutral-300/80 bg-neutral-100/60 px-4 py-3 text-xs text-neutral-600">
                <div>
                  <p className="font-semibold uppercase tracking-[0.25em] text-neutral-500">
                    Integrations ready
                  </p>
                  <p>Shopify, Klaviyo, Attentive, Alloy, Meta Ads</p>
                </div>
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                  beta
                </span>
              </div>
            </article>
          </section>

          <section id="lead-capture" className="flex flex-col gap-6">
            <LeadAgent />
            <article className="rounded-3xl border border-neutral-900/10 bg-white/80 p-6 shadow-lg shadow-neutral-200/60 backdrop-blur">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                  Lead magnet
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                  Download the SS24 Lookbook Blueprint
                </h3>
                <p className="text-sm leading-6 text-neutral-600">
                  Framework we use to take a cold TikTok scroller to a three-look cart. Includes
                  narrative arcs, wardrobe builder prompts, and Klaviyo automations.
                </p>
              </div>
              <form className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="brand@studio.com"
                  className="h-11 flex-1 rounded-full border border-neutral-200 bg-white px-4 text-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                  required
                />
                <button
                  type="submit"
                  className="h-11 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white shadow-lg shadow-neutral-300/60 transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  Send lookbook
                </button>
              </form>
              <p className="pt-3 text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                Zero spam. Pure playbooks.
              </p>
            </article>

            <article className="rounded-3xl border border-neutral-900/10 bg-white/80 p-6 shadow-lg shadow-neutral-200/60 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                Case study snapshot
              </p>
              <h3 className="pt-3 text-lg font-semibold tracking-tight text-neutral-900">
                SAINT/CO saw 2.1x lead-to-checkout velocity in 45 days
              </h3>
              <div className="mt-5 grid gap-4 text-sm text-neutral-600 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-900/10 bg-white/80 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Before</p>
                  <p className="pt-2 text-sm">
                    Manual Instagram DM responses, 18-hour lag, 17% checkout completion.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-900/10 bg-neutral-900/95 px-4 py-3 text-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">After</p>
                  <p className="pt-2 text-sm">
                    Automated concierge with Luma, same-day curated bundles, 36% checkout completion.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-neutral-200 bg-neutral-100/70 p-4 text-xs text-neutral-600">
                “We finally see intent signals we can act on. Luma tells us who is capsule-ready and
                routes them straight into the stylists’ Airtable.”
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
