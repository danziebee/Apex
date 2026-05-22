import { HeroVSL } from "@/components/HeroVSL";
import { PartnershipFolders } from "@/components/PartnershipFolders";
import { PillButton } from "@/components/PillButton";
import { ServicesGrid } from "@/components/ServicesGrid";
import { TeamSection } from "@/components/TeamSection";
import { BOOK_CALL_URL } from "@/lib/content";

export default function Home() {
  return (
    <main>
      {/* Hero copy */}
      <section className="apex-section !pt-4 !pb-14 md:!pt-6 md:!pb-20">
        <div className="apex-container-wide">
          <div className="apex-container">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              Predictable growth,{" "}
              <span className="text-gradient-blue">built for you.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-apex-muted md:text-lg">
              We design predictable, scalable revenue engines powered by smart
              systems, high-performance teams, and offers built to convert.
            </p>
          </div>
        </div>
      </section>

      <HeroVSL />

      {/* Framework */}
      <section className="apex-section apex-section-surface">
        <div className="apex-container-wide">
          <div className="apex-container">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Framework:</h2>
            <p className="mt-1 text-2xl tracking-tight text-gradient-blue md:text-3xl">
              <span className="font-extrabold">Diagnose</span>,{" "}
              <span className="font-extrabold">Build</span>,{" "}
              <span className="font-extrabold">Optimize</span>
            </p>

            <div className="mt-16 space-y-14">
              {[
                {
                  title: "Diagnose & Audit",
                  body: "We identify bottlenecks across your sales process, team, and infrastructure.",
                },
                {
                  title: "Build & Align",
                  body: "We build your core systems and refine your brand and operations to support clear, consistent execution.",
                },
                {
                  title: "Optimize & Scale",
                  body: "We refine performance, remove inefficiencies, and prepare your operation for increased volume.",
                },
              ].map((step) => (
                <div key={step.title}>
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-apex-muted">{step.body}</p>
                </div>
              ))}

              <div className="border-t border-white/10 pt-14">
                <h3 className="text-xl font-bold text-white md:text-2xl">
                  Operators, Not Vendors.
                </h3>
                <p className="mt-3 leading-relaxed text-apex-muted">
                  We act as operators inside your business, owning revenue systems,
                  team performance, and operational scale.
                </p>
                <p className="mt-4 font-bold leading-relaxed text-gradient-blue">
                  Better systems. Better decisions. Better results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="apex-section">
        <div className="apex-container-wide">
          <div className="apex-container">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">What we build.</h2>
          </div>
          <div className="mt-12">
            <ServicesGrid />
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="apex-section apex-section-surface">
        <div className="apex-container-wide">
          <div className="apex-container">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">How We Work</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-apex-muted">
              Depending on your business model and stage, we partner in one of two
              ways: Either building and managing your revenue systems directly, or
              aligning on performance through a shared upside.
            </p>
          </div>
          <div className="mt-14">
            <PartnershipFolders />
          </div>
        </div>
      </section>

      {/* Fit */}
      <section className="apex-section">
        <div className="apex-container-wide">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-16 md:grid-cols-2">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Who This Is For</h2>
                <ul className="mt-8 space-y-4 text-apex-muted md:text-lg">
                  <li>High-ticket businesses with proven demand</li>
                  <li>
                    Founders looking to scale sales beyond founder-led closing
                  </li>
                  <li>
                    Teams struggling with inconsistent revenue or bottlenecks
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">This Is Not For</h2>
                <ul className="mt-8 space-y-4 text-apex-muted md:text-lg">
                  <li>Early-stage ideas without validation</li>
                  <li>
                    Businesses reliant purely on content without sales systems
                  </li>
                  <li>
                    Companies without consistent demand or offer-market fit
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="apex-section apex-section-surface">
        <div className="apex-container-wide">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Build a revenue engine that runs without you
            </h2>
            <div className="mt-10">
              <PillButton href={BOOK_CALL_URL}>Book A Strategy Call</PillButton>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="apex-section !pb-32">
        <div className="apex-container-wide">
          <div className="mx-auto max-w-4xl">
            <TeamSection />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="apex-container-wide py-10">
          <div className="flex flex-col gap-2 text-sm text-apex-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Apex Growth Operations</p>
            <a
              href="mailto:daniel@apexgrowth.net"
              className="transition-colors hover:text-white"
            >
              daniel@apexgrowth.net
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
