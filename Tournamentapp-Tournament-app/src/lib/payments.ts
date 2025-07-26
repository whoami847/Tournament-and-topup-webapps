export type PaymentMethod = {
  id: string;
  name: string;
  accountNumber: string;
  accountType: 'Personal' | 'Agent';
  logoUrl: string;
  imageHint: string;
  enabled: boolean;
};

export type Order = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  userId: string;
  productDetails?: any;
  gatewayId?: string;
  paymentDetails?: any;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  userId: string;
};