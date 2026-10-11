import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { AuthSessionHandler } from "@/components/auth/AuthSessionHandler";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";

/**
 * ISR: paginile publice sunt regenerate cel mult o dată la 5 minute (și imediat la
 * revalidatePath din admin). Layout-ul NU citește cookie-uri — coșul și utilizatorul
 * sunt încărcate în Header din /api/header-state. Paginile care chiar au nevoie de
 * date per utilizator (coș, checkout, cont) citesc ele cookie-urile și rămân dinamice.
 */
export const revalidate = 300;

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await getSiteContactSettings();

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
      <div className="site-shell flex min-h-screen min-w-0 flex-col overflow-x-hidden">
        <Header contact={contact} />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer contact={contact} />
        <WhatsAppFloatingButton phone={contact.phoneOrders} />
      </div>
    </>
  );
}
