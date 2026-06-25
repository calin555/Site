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
import { getCurrentUser } from "@/lib/auth/get-user";
import { getAccountNavCounts } from "@/lib/account/get-account-data";
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

  const accountCounts = user
    ? await getAccountNavCounts(user.id, user.email)
    : undefined;

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
        <Header
          cartCount={summary.itemCount}
          contact={contact}
          user={user}
          accountCounts={accountCounts}
        />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer contact={contact} />
        <WhatsAppFloatingButton phone={contact.phoneOrders} />
      </div>
    </>
  );
}
