'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  return (
    <Card className="max-w-lg mx-auto bg-secondary/30">
      <CardContent className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your payment! Your tournament entry fee has been processed successfully. 
          {tournamentId ? ' You can now complete your tournament registration.' : ' You can now view your tournaments and track your progress.'}
        </p>
        <div className="flex gap-4 mt-4">
          {tournamentId ? (
            <>
              <Link href={`/tournaments/${tournamentId}/join`} passHref>
                <Button size="lg">Complete Registration</Button>
              </Link>
              <Link href={`/tournaments/${tournamentId}`} passHref>
                <Button size="lg" variant="outline">View Tournament</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/tournaments" passHref>
                <Button size="lg">View Tournaments</Button>
              </Link>
              <Link href="/" passHref>
                <Button size="lg" variant="outline">Go to Home</Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="container py-12 md:py-24">
      <Suspense fallback={
        <Card className="max-w-lg mx-auto bg-secondary/30">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-8 md:p-12 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
            <h1 className="text-3xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}