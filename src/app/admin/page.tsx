
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Users, Swords, List, Settings, LucideIcon, Gamepad2, Image as ImageIcon, ClipboardCheck, Award, Banknote, ListChecks, Upload, History, CreditCard, Receipt } from "lucide-react";

const adminControls: { href: string; icon: LucideIcon; label: string }[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/banners', icon: ImageIcon, label: 'Banners' },
  { href: '/admin/tournaments', icon: Swords, label: 'Tournaments' },
  { href: '/admin/games', icon: Gamepad2, label: 'Games' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/results-approval', icon: ClipboardCheck, label: 'Results Approval' },
  { href: '/admin/prize-approvals', icon: Award, label: 'Prize Approvals' },
  { href: '/admin/requests', icon: List, label: 'Registration Log' },
  { href: '/admin/gateways', icon: CreditCard, label: 'Payment Gateways' },
  { href: '/admin/payment-orders', icon: Receipt, label: 'Payment Orders' },
  { href: '/admin/transactions', icon: History, label: 'Transactions' },
  { href: '/admin/topup-settings', icon: Settings, label: 'Topup Settings' },
  { href: '/admin/topup-requests', icon: Upload, label: 'Topup Requests' },
  { href: '/admin/withdraw-methods', icon: Banknote, label: 'Withdraw Methods' },
  { href: '/admin/withdraw-requests', icon: ListChecks, label: 'Withdraw Requests' },
];

const AdminControlCard = ({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) => (
    <Link href={href} className="block">
        <Card className="hover:bg-accent hover:border-primary transition-colors h-full shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-4 text-center aspect-square">
                <Icon className="h-10 w-10 text-primary" />
                <span className="font-semibold mt-2">{label}</span>
            </CardContent>
        </Card>
    </Link>
);


export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
                <p className="text-muted-foreground">Manage your esports platform from here</p>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden md:block">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {adminControls.map((control) => (
                        <AdminControlCard key={control.href} {...control} />
                    ))}
                </div>
            </div>
            
            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="grid grid-cols-2 gap-4">
                    {adminControls.map((control) => (
                        <AdminControlCard key={control.href} {...control} />
                    ))}
                </div>
            </div>
        </div>
    );
}
