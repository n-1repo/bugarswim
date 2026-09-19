import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { roleHome } from "@/lib/auth/roles";
import { getPublicPrograms } from "@/lib/data/landing";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProgramsSection } from "@/components/landing/programs-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { TermsSection } from "@/components/landing/terms-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default async function Home() {
  const session = await getSession();
  if (session) redirect(roleHome(session.app_role));

  const programs = await getPublicPrograms();
  const validityWeeks = programs.find((p) => p.validityWeeks)?.validityWeeks ?? 6;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main>
        <HeroSection />
        <ProgramsSection />
        <PricingSection programs={programs} validityWeeks={validityWeeks} />
        <BenefitsSection />
        <TermsSection validityWeeks={validityWeeks} />
      </main>
      <SiteFooter />
    </div>
  );
}
