import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthSessionHandler } from "@/components/auth/AuthSessionHandler";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getCartSummary } from "@/lib/services/cart.service";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [summary, contact, user] = await Promise.all([
    getCartSummary(),
    getSiteContactSettings(),
    getCurrentUser(),
  ]);

  return (
    <>
      <Suspense fallback={null}>
        <AuthSessionHandler />
      </Suspense>
      <JsonLd
        data={[
          buildOrganizationSchema(),
          buildLocalBusinessSchema(),
          buildWebSiteSchema(),
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header cartCount={summary.itemCount} contact={contact} user={user} />
        <main className="flex-1">{children}</main>
        <Footer contact={contact} />
      </div>
    </>
  );
}
