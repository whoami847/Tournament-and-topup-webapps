import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, writeBatch, collection } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Gateway } from '@/lib/gateways';
import type { Order, Transaction } from '@/lib/payments';
import { format } from 'date-fns';

const RUPANTORPAY_VERIFY_URL = 'https://payment.rupantorpay.com/api/payment/verify-payment';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get('transaction_id');
  const status = searchParams.get('status');

  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');
  const baseUrl = `${protocol}://${host}`;

  if (!transactionId) {
    return NextResponse.redirect(`${baseUrl}/payment/fail?error=notransactionid`);
  }

  // Handle immediate cancel or fail without verification
  if (status === 'cancel' || status === 'fail') {
    const newStatus = status === 'cancel' ? 'CANCELLED' : 'FAILED';
    await updateDoc(doc(firestore, 'orders', transactionId), { status: newStatus });
    return NextResponse.redirect(`${baseUrl}/payment/fail?status=${status}`);
  }
  
  // For success, we must verify with the server
  try {
    const orderRef = doc(firestore, 'orders', transactionId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.redirect(`${baseUrl}/payment/fail?error=ordernotfound`);
    }

    const orderData = orderDoc.data() as Order;
    
    // Prevent reprocessing a completed order
    if (orderData.status !== 'PENDING') {
      return NextResponse.redirect(`${baseUrl}/payment/success?status=alreadyprocessed`);
    }

    if (!orderData.gatewayId) {
       return NextResponse.redirect(`${baseUrl}/payment/fail?error=nogateway`);
    }

    const gatewayDoc = await getDoc(doc(firestore, 'gateways', orderData.gatewayId));
    if (!gatewayDoc.exists()) {
      return NextResponse.redirect(`${baseUrl}/payment/fail?error=gatewaynotfound`);
    }
    const gateway = gatewayDoc.data() as Gateway;

    // Verify payment with RupantorPay
    const verifyResponse = await fetch(RUPANTORPAY_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            access_token: gateway.storePassword,
            transaction_id: transactionId,
        }),
    });
    
    const verificationResult = await verifyResponse.json();
    
    // Check if the payment was successfully verified as completed
    if (verificationResult.status === 'COMPLETED') {
        const batch = writeBatch(firestore);

        // 1. Update order status
        batch.update(orderRef, { status: 'COMPLETED', paymentDetails: verificationResult });

        // 2. Create a transaction record for history
        const transactionRef = doc(collection(firestore, 'transactions'));
        const newTransaction: Omit<Transaction, 'id'> = {
            date: format(new Date(), 'dd/MM/yyyy, HH:mm:ss'),
            description: `Tournament Entry Fee Payment via ${gateway.name}`,
            amount: orderData.amount,
            status: 'Completed',
            userId: orderData.userId,
        };
        batch.set(transactionRef, newTransaction);
        
        await batch.commit();

        // Check if this is a tournament payment and redirect accordingly
        const tournamentId = orderData.paymentDetails?.tournamentId;
        if (tournamentId) {
            return NextResponse.redirect(`${baseUrl}/payment/success?tournamentId=${tournamentId}`);
        }

        return NextResponse.redirect(`${baseUrl}/payment/success`);
    } else {
        // If verification fails or status is not COMPLETED, mark order as FAILED
        await updateDoc(orderRef, { status: 'FAILED', paymentDetails: verificationResult });
        return NextResponse.redirect(`${baseUrl}/payment/fail?status=verificationfailed`);
    }

  } catch (error) {
    console.error('Callback handling error:', error);
    return NextResponse.redirect(`${baseUrl}/payment/fail?error=internal`);
  }
}