import type { PublicUser } from "@/types/user";
import type { AccountNavCounts } from "@/config/account-nav";

export interface HeaderState {
  cartCount: number;
  user: PublicUser | null;
  accountCounts?: AccountNavCounts;
}
