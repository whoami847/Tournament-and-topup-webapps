'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, FileText, Zap, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getTournament } from '@/lib/tournaments-service';
import { useToast } from '@/hooks/use-toast';
import type { Tournament } from '@/types';

export default function PaymentOptionsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleAutoPayment = async () => {
    if (!tournament || !user) return;

    try {
      toast({
        title: "Initiating Payment",
        description: "Please wait while we prepare your payment...",
      });

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: tournament.entryFee,
          userId: user.uid,
          tournamentId: tournament.id,
          description: `Tournament Entry Fee - ${tournament.name}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.payment_url) {
        // Redirect to payment gateway
        window.location.href = data.payment_url;
      } else {
        toast({
          title: "Payment Failed",
          description: data.message || "Failed to initiate payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Error",
        description: "An error occurred while initiating payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManualPayment = () => {
    if (!tournament) return;
    router.push(`/tournaments/${tournament.id}/manual-payment`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading payment options...</div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Tournament not found</div>
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

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Payment Method</h1>
          <p className="text-muted-foreground">
            Tournament: <span className="font-semibold text-foreground">{tournament.name}</span>
          </p>
          <p className="text-lg font-semibold mt-2">
            Entry Fee: <span className="text-primary">৳{tournament.entryFee}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Auto Payment Option */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Auto Payment
                </CardTitle>
                <Badge variant="default" className="bg-blue-500">
                  Instant
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span>Secure payment gateway</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span>Mobile banking & cards accepted</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleAutoPayment} 
                  className="w-full"
                  size="lg"
                >
                  Pay Now ৳{tournament.entryFee}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Payment Option */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Manual Payment
                </CardTitle>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Review
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>Bank transfer / Mobile banking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>Submit payment screenshot</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>Admin verification required</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleManualPayment} 
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Submit Manual Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Having trouble with payment? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}