"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export function AutomatedWalletTopUpForm() {
  const { gateways } = useAppStore();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const enabledGateways = gateways.filter((g) => g.enabled);
  const isGatewayAvailable = enabledGateways.length > 0;

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to top up your wallet.",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount, userId: user.id }),
      });

      const data = await response.json();

      if (response.ok && data.payment_url) {
        router.push(data.payment_url);
      } else {
        throw new Error(data.error || "Failed to initiate payment.");
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount to top up"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!isGatewayAvailable || isLoading}
        />
      </div>
      {isGatewayAvailable ? (
        <Button onClick={handlePayment} disabled={isLoading || !amount}>
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </Button>
      ) : (
        <p className="text-sm text-red-500">
          No automated payment gateways are currently enabled.
        </p>
      )}
    </div>
  );
}
