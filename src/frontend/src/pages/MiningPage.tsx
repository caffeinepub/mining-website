import { useGetMiningTasks, useGetCallerUserProfile } from '../hooks/useQueries';
import MiningPanel from '../components/MiningPanel';
import MiningStatus from '../components/MiningStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Wallet } from 'lucide-react';

export default function MiningPage() {
  const { data: miningTasks } = useGetMiningTasks();
  const { data: userProfile } = useGetCallerUserProfile();

  const balance = userProfile ? Number(userProfile.balance) / 10 : 0;

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mining</h1>
        <p className="text-muted-foreground">Start mining and earn 2 USDT per day automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.toFixed(2)} USDT</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mining Information</CardTitle>
            <CardDescription>
              Each mining session earns 2 USDT per day. You can run multiple mining tasks simultaneously.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiningPanel />
        <MiningStatus tasks={miningTasks || []} />
      </div>
    </div>
  );
}
