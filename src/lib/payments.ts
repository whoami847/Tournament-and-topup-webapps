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

export type ManualPaymentRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  tournamentId: string;
  tournamentName: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  screenshot?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
};

export type PaymentOption = 'AUTO' | 'MANUAL';