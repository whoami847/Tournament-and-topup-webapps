import { firestore } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import type { PaymentMethod, ManualPaymentRequest } from './payments';
import { format } from 'date-fns';

const paymentMethodsCollection = collection(firestore, 'paymentMethods');
const manualPaymentRequestsCollection = collection(firestore, 'manualPaymentRequests');

// Payment Methods Management
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const querySnapshot = await getDocs(paymentMethodsCollection);
    const methods: PaymentMethod[] = [];
    querySnapshot.forEach((doc) => {
      methods.push({ id: doc.id, ...doc.data() } as PaymentMethod);
    });
    return methods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>): Promise<void> => {
  try {
    await addDoc(paymentMethodsCollection, method);
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

export const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<void> => {
  try {
    const methodDoc = doc(firestore, 'paymentMethods', id);
    await updateDoc(methodDoc, updates);
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, 'paymentMethods', id));
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

// Manual Payment Requests Management
export const submitManualPaymentRequest = async (request: Omit<ManualPaymentRequest, 'id' | 'submittedAt' | 'status'>): Promise<void> => {
  try {
    const newRequest: Omit<ManualPaymentRequest, 'id'> = {
      ...request,
      status: 'PENDING',
      submittedAt: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
    };
    await addDoc(manualPaymentRequestsCollection, newRequest);
  } catch (error) {
    console.error('Error submitting manual payment request:', error);
    throw error;
  }
};

export const getManualPaymentRequests = async (): Promise<ManualPaymentRequest[]> => {
  try {
    const q = query(manualPaymentRequestsCollection, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const requests: ManualPaymentRequest[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as ManualPaymentRequest);
    });
    return requests;
  } catch (error) {
    console.error('Error fetching manual payment requests:', error);
    return [];
  }
};

export const getUserManualPaymentRequests = async (userId: string): Promise<ManualPaymentRequest[]> => {
  try {
    const q = query(
      manualPaymentRequestsCollection, 
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const requests: ManualPaymentRequest[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as ManualPaymentRequest);
    });
    return requests;
  } catch (error) {
    console.error('Error fetching user manual payment requests:', error);
    return [];
  }
};

export const getTournamentManualPaymentRequests = async (tournamentId: string): Promise<ManualPaymentRequest[]> => {
  try {
    const q = query(
      manualPaymentRequestsCollection, 
      where('tournamentId', '==', tournamentId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const requests: ManualPaymentRequest[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as ManualPaymentRequest);
    });
    return requests;
  } catch (error) {
    console.error('Error fetching tournament manual payment requests:', error);
    return [];
  }
};

export const approveManualPaymentRequest = async (
  requestId: string, 
  adminUserId: string,
  adminNotes?: string
): Promise<void> => {
  try {
    const requestDoc = doc(firestore, 'manualPaymentRequests', requestId);
    await updateDoc(requestDoc, {
      status: 'APPROVED',
      reviewedAt: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
      reviewedBy: adminUserId,
      adminNotes: adminNotes || '',
    });
  } catch (error) {
    console.error('Error approving manual payment request:', error);
    throw error;
  }
};

export const rejectManualPaymentRequest = async (
  requestId: string, 
  adminUserId: string,
  adminNotes?: string
): Promise<void> => {
  try {
    const requestDoc = doc(firestore, 'manualPaymentRequests', requestId);
    await updateDoc(requestDoc, {
      status: 'REJECTED',
      reviewedAt: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
      reviewedBy: adminUserId,
      adminNotes: adminNotes || '',
    });
  } catch (error) {
    console.error('Error rejecting manual payment request:', error);
    throw error;
  }
};

export const checkApprovedManualPayment = async (userId: string, tournamentId: string): Promise<boolean> => {
  try {
    const q = query(
      manualPaymentRequestsCollection,
      where('userId', '==', userId),
      where('tournamentId', '==', tournamentId),
      where('status', '==', 'APPROVED')
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking approved manual payment:', error);
    return false;
  }
};