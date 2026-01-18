import { z } from 'zod';

export const transactionSchema = z.object({
  customerId: z.number().min(1, 'Customer ID is required'),
  productId: z.number().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  paymentMethod: z.string().refine(
    (val) => ['credit_card', 'google_pay', 'apple_pay', 'bank_transfer', 'paypal'].includes(val),
    { message: 'Invalid payment method' }
  ),
  discountApplied: z.number().min(0).max(100),
  shippingCost: z.number().min(0),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export interface TransactionPayload extends TransactionFormData {
  totalAmount: number;
  status: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  taxAmount: number;
}
