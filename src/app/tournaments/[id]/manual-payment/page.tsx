'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getTournament } from '@/lib/tournaments-service';
import { getTopupMethodsStream } from '@/lib/topup-settings-service';
import { createTopupRequest } from '@/lib/topup-requests-service';
import { useToast } from '@/hooks/use-toast';
import { getUserProfileStream } from '@/lib/users-service';
import type { Tournament, TopupMethod, PlayerProfile } from '@/types';

export default function ManualPaymentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [topupMethods, setTopupMethods] = useState<TopupMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<TopupMethod | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      const fetchTournament = async () => {
        const data = await getTournament(params.id);
        if (data) {
          setTournament(data);
        } else {
          router.push('/tournaments');
        }
        setLoading(false);
      };
      fetchTournament();
    }
  }, [params.id, router]);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = getUserProfileStream(user.uid, setProfile);
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = getTopupMethodsStream((methods) => {
      const activeMethods = methods.filter(method => method.status === 'active');
      setTopupMethods(activeMethods);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!tournament || !user || !profile || !selectedMethod || !transactionId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createTopupRequest({
        userId: user.uid,
        userName: profile.name,
        userGamerId: profile.gamerId,
        amount: tournament.entryFee,
        method: selectedMethod.name,
        transactionId: transactionId.trim(),
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        isForTournament: true,
      });

      toast({
        title: "Payment Request Submitted!",
        description: "Your manual payment request has been submitted for review. You will be notified once it's approved.",
      });

      router.push(`/tournaments/${tournament.id}`);
    } catch (error) {
      console.error('Error submitting manual payment:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit payment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading manual payment form...</div>
        </div>
      </div>
    );
  }

  if (!tournament || !user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Required information not available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:pb-8 pb-24">
      <div className="relative">
        <Button variant="outline" size="icon" className="absolute -top-4 -left-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Manual Payment</h1>
          <p className="text-muted-foreground">
            Tournament: <span className="font-semibold text-foreground">{tournament.name}</span>
          </p>
          <p className="text-lg font-semibold mt-2">
            Entry Fee: <span className="text-primary">৳{tournament.entryFee}</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Methods */}
            <div>
              <Label className="text-base font-semibold">Choose Payment Method</Label>
              <div className="grid gap-3 mt-3">
                {topupMethods.length > 0 ? (
                  topupMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedMethod?.id === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      <div className="flex items-center gap-3">
                        {method.image ? (
                          <Image
                            src={method.image}
                            alt={method.name}
                            width={40}
                            height={40}
                            className="rounded-md object-contain"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
                            No Icon
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Account: {method.accountNumber}
                          </p>
                        </div>
                        {selectedMethod?.id === method.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment methods available. Please contact admin.
                  </div>
                )}
              </div>
            </div>

            {/* Payment Instructions */}
            {selectedMethod && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Instructions</h4>
                <div className="text-sm whitespace-pre-line text-muted-foreground">
                  {selectedMethod.instructions}
                </div>
              </div>
            )}

            {/* Transaction ID */}
            <div>
              <Label htmlFor="transactionId">Transaction ID / Reference Number *</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID from your payment"
                className="mt-2"
                disabled={!selectedMethod}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter the transaction ID or reference number you received after making the payment
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedMethod || !transactionId.trim() || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Payment Request"}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              <p>
                Your payment request will be reviewed by admin. You will be notified once approved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}