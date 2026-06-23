import type { OrderRecord } from "@/types/order";

class OrderStore {
  private byNumber = new Map<string, OrderRecord>();
  private paymentIntentIndex = new Map<string, string>();

  save(order: OrderRecord): void {
    this.byNumber.set(order.orderNumber, order);
    if (order.stripePaymentIntentId) {
      this.paymentIntentIndex.set(order.stripePaymentIntentId, order.orderNumber);
    }
  }

  getByNumber(orderNumber: string): OrderRecord | null {
    return this.byNumber.get(orderNumber) ?? null;
  }

  getByPaymentIntentId(paymentIntentId: string): OrderRecord | null {
    const orderNumber = this.paymentIntentIndex.get(paymentIntentId);
    if (!orderNumber) return null;
    return this.byNumber.get(orderNumber) ?? null;
  }

  update(
    orderNumber: string,
    patch: Partial<OrderRecord>
  ): OrderRecord | null {
    const existing = this.byNumber.get(orderNumber);
    if (!existing) return null;

    const updated: OrderRecord = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (
      patch.stripePaymentIntentId &&
      patch.stripePaymentIntentId !== existing.stripePaymentIntentId
    ) {
      this.paymentIntentIndex.set(patch.stripePaymentIntentId, orderNumber);
    }

    this.byNumber.set(orderNumber, updated);
    return updated;
  }

  list(): OrderRecord[] {
    return Array.from(this.byNumber.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  listByUser(userId: string, email: string): OrderRecord[] {
    return this.list().filter(
      (o) => o.userId === userId || o.email.toLowerCase() === email.toLowerCase()
    );
  }
}

export const orderStore = new OrderStore();
