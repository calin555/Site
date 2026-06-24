import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";
import { getCartSummary } from "@/lib/services/cart.service";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [summary, contact] = await Promise.all([
    getCartSummary(),
    getSiteContactSettings(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          buildOrganizationSchema(),
          buildLocalBusinessSchema(),
          buildWebSiteSchema(),
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header cartCount={summary.itemCount} contact={contact} />
        <main className="flex-1">{children}</main>
        <Footer contact={contact} />
      </div>
    </>
  );
}
