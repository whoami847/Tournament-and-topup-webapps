import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Order } from '@/lib/payments';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  const userId = searchParams.get('userId');

  if (!tournamentId || !userId) {
    return NextResponse.json(
      { message: 'Tournament ID and User ID are required' },
      { status: 400 }
    );
  }

  try {
    // Query orders collection for completed payments for this tournament and user
    const ordersRef = collection(firestore, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      where('status', '==', 'COMPLETED')
    );

    const querySnapshot = await getDocs(q);
    
    // Check if any completed order is for this tournament
    let hasValidPayment = false;
    
    querySnapshot.forEach((doc) => {
      const orderData = doc.data() as Order;
      if (orderData.paymentDetails?.tournamentId === tournamentId) {
        hasValidPayment = true;
      }
    });

    return NextResponse.json({ hasValidPayment });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}