export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { TopupRequest } from '@/types';

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
    // Query topup requests collection for approved tournament payments
    const requestsRef = collection(firestore, 'topupRequests');
    const q = query(
      requestsRef,
      where('userId', '==', userId),
      where('tournamentId', '==', tournamentId),
      where('status', '==', 'approved'),
      where('isForTournament', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const hasValidPayment = !querySnapshot.empty;

    return NextResponse.json({ hasValidPayment });
  } catch (error) {
    console.error('Error checking manual payment status:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}