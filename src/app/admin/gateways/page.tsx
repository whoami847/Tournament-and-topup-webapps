"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Gateway } from "@/lib/gateways";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { GatewayDialog } from "@/components/admin/gateway-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function GatewaysPage() {
  const { gateways, loadGateways, deleteGateway } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const { toast } = useToast();

  // Load gateways on component mount
  useEffect(() => {
    loadGateways();
  }, [loadGateways]);

  const handleEdit = (gateway: Gateway) => {
    setSelectedGateway(gateway);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this gateway?")) {
      try {
        await deleteGateway(id);
        toast({ title: "Success", description: "Gateway deleted successfully." });
      } catch (error) {
        console.error("Failed to delete gateway:", error);
        toast({
          title: "Error",
          description: "Failed to delete gateway. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddNew = () => {
    setSelectedGateway(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payment Gateways</h1>
        <Button onClick={handleAddNew}>New Gateway</Button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gateways.length > 0 ? (
              gateways.map((gateway) => (
                <TableRow key={gateway.id}>
                  <TableCell>{gateway.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={gateway.enabled ? "default" : "destructive"}
                    >
                      {gateway.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={gateway.isLive ? "default" : "secondary"}>
                      {gateway.isLive ? "Live" : "Sandbox"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(gateway)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(gateway.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No gateways found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <GatewayDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        gateway={selectedGateway}
      />
    </div>
  );
}
