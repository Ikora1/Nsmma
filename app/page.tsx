import { Header } from "@/components/boty/header"
import { Hero } from "@/components/boty/hero"
import { TrustBadges } from "@/components/boty/trust-badges"
import { FeatureSection } from "@/components/boty/feature-section"
import { ProductGrid } from "@/components/boty/product-grid"
import { IngredientsSection } from "@/components/boty/ingredients-section"
import { ImpactSection } from "@/components/boty/impact-section"
import { Testimonials } from "@/components/boty/testimonials"
import { CTABanner } from "@/components/boty/cta-banner"
import { Newsletter } from "@/components/boty/newsletter"
import { Footer } from "@/components/boty/footer"
import { getProducts } from "@/lib/shopify"

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <TrustBadges />
      <div id="collection" className="scroll-mt-24">
        <ProductGrid products={products} />
      </div>
      <div id="why-nasmma" className="scroll-mt-24">
        <FeatureSection />
      </div>
      <div id="impact" className="scroll-mt-24">
        <ImpactSection />
      </div>
      <div id="sourcing" className="scroll-mt-24">
        <IngredientsSection />
      </div>
      <div id="reviews" className="scroll-mt-24">
        <Testimonials />
      </div>
      <CTABanner />
      <Newsletter />
      <Footer />
    </main>
  )
}
