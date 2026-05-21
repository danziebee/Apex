import { services } from "@/lib/content";
import { GlimmerCard } from "./GlimmerCard";
import { ServiceIcon } from "./ServiceIcon";

export function ServicesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => (
        <GlimmerCard key={service.title} className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white md:text-xl">
                {service.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-apex-muted md:text-base">
                {service.description}
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03]">
              <ServiceIcon name={service.icon} />
            </div>
          </div>
        </GlimmerCard>
      ))}
    </div>
  );
}
