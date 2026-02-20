import { useIsCallerAdmin } from '../hooks/useQueries';
import AdminWithdrawalQueue from '../components/AdminWithdrawalQueue';
import AdminUserApprovalList from '../components/AdminUserApprovalList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Shield, Wallet, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage withdrawals and user approvals.</p>
      </div>

      <Tabs defaultValue="withdrawals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="withdrawals" className="gap-2">
            <Wallet className="h-4 w-4" />
            Withdrawals
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Approvals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals">
          <AdminWithdrawalQueue />
        </TabsContent>

        <TabsContent value="users">
          <AdminUserApprovalList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
