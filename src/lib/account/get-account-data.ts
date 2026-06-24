import { requireAuth } from "@/lib/auth/get-user";
import { listOrdersForUser } from "@/lib/services/order.service";
import { listUserAddresses, seedDemoAddress } from "@/lib/services/address.service";
import { canDownloadInvoice } from "@/lib/invoices/generate-invoice";
import type { AccountNavCounts } from "@/config/account-nav";

export async function getAccountNavCounts(
  userId: string,
  email: string
): Promise<AccountNavCounts> {
  const [orders, addresses] = await Promise.all([
    listOrdersForUser(userId, email),
    listUserAddresses(userId),
  ]);

  return {
    orders: orders.length,
    addresses: addresses.length,
    invoices: orders.filter(canDownloadInvoice).length,
  };
}

export async function getAccountData() {
  const user = await requireAuth();

  if (user.id === "usr_demo") {
    await seedDemoAddress(user.id);
  }

  const [orders, addresses] = await Promise.all([
    listOrdersForUser(user.id, user.email),
    listUserAddresses(user.id),
  ]);

  const invoices = orders.filter(canDownloadInvoice);

  return {
    user,
    orders,
    addresses,
    counts: {
      orders: orders.length,
      addresses: addresses.length,
      invoices: invoices.length,
    },
  };
}
