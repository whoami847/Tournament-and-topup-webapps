"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { Gateway } from "@/lib/gateways";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GatewayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gateway?: Gateway | null;
}

export function GatewayDialog({
  isOpen,
  onClose,
  gateway,
}: GatewayDialogProps) {
  const { addGateway, updateGateway } = useAppStore();
  const [name, setName] = useState("RupantorPay");
  const [storePassword, setStorePassword] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (gateway) {
      setName(gateway.name);
      setStorePassword(gateway.storePassword || "");
      setIsLive(gateway.isLive);
      setEnabled(gateway.enabled);
    } else {
      setName("RupantorPay");
      setStorePassword("");
      setIsLive(false);
      setEnabled(true);
    }
  }, [gateway]);

  const handleSubmit = async () => {
    try {
      if (gateway) {
        await updateGateway(gateway.id, {
          storePassword,
          isLive,
          enabled,
        });
        toast({ title: "Success", description: "Gateway updated successfully." });
      } else {
        await addGateway({
          name,
          storePassword,
          isLive,
          enabled,
        });
        toast({ title: "Success", description: "Gateway added successfully." });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save gateway:", error);
      toast({
        title: "Error",
        description: "Failed to save gateway. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{gateway ? "Edit Gateway" : "Add Gateway"}</DialogTitle>
          <DialogDescription>
            {gateway
              ? "Update the details of your payment gateway."
              : "Add a new payment gateway to accept payments."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Gateway Name
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., RupantorPay, SSLCommerz"
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="store-password" className="text-right">
              Store Password
            </Label>
            <Input
              id="store-password"
              type="password"
              value={storePassword}
              onChange={(e) => setStorePassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <Label htmlFor="mode-switch">Mode (Live/Sandbox)</Label>
            <Switch
              id="mode-switch"
              checked={isLive}
              onCheckedChange={setIsLive}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="status-switch">Status (Enabled/Disabled)</Label>
            <Switch
              id="status-switch"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {gateway ? "Save Changes" : "Add Gateway"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
