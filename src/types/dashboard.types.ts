export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

export interface SalesDataPoint {
  time: string;
  sales: number;
  orders: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  stock: number;
  stockStatus: 'low' | 'medium' | 'healthy';
  trend: 'up' | 'down' | 'stable';
}

export interface Transaction {
  id: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  paymentMethod: string;
}

export interface DashboardOverviewData {
  totalRevenue: number;
  totalTransactions: number;
  averageOrderValue: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  pendingTransactions: number;
  flaggedTransactions: number;
}

export interface DashboardOverviewTrends {
  revenueChange: number;
  transactionsChange: number;
}

export interface DashboardOverviewResponse {
  data: DashboardOverviewData;
  trends: DashboardOverviewTrends;
}

export interface Supplier {
  id: number;
  name: string;
  contactEmail: string;
  phone: string;
  address: string;
  country: string;
  reliabilityScore: number;
  averageDeliveryDays: number;
  paymentTerms: string;
  establishedDate: string;
  certification: string | null;
}

export interface LowStockProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  stockQuantity: number;
  supplierId: number;
  sku: string;
  description: string;
  weight: number;
  dimensions: string;
  warrantyMonths: number;
  createdAt: string;
  supplier: Supplier;
}

export interface LowStockInventoryResponse {
  products: LowStockProduct[];
  threshold: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface BestPerformingProduct {
  productId: number;
  productName: string;
  category: string;
  sku: string;
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  currentStock: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  category: string;
  price: string;
  stockQuantity: number;
  supplierId: number;
  sku: string;
  description: string;
  weight: number;
  dimensions: string;
  warrantyMonths: number;
  createdAt: string;
  supplier: Supplier;
}

export interface ProductListItem {
  id: number;
  name: string;
  category: string;
  price: string;
  stockQuantity: number;
  supplierId: number;
  sku: string;
  description: string | null;
  weight: number;
  dimensions: string;
  warrantyMonths: number | null;
  createdAt: string;
  supplier: {
    id: number;
    name: string;
    country: string;
    reliabilityScore: number;
  };
}

export interface ProductListResponse {
  data: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionListItem {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  discountApplied: string;
  taxAmount: string;
  shippingCost: string;
  customer: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
    price: string;
  };
}

export interface TransactionListResponse {
  data: TransactionListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TabValue = 'overview' | 'analytics' | 'products' | 'orders' | 'transactions' | 'customers' | 'settings';
