import { useGetCallerUserProfile, useGetMiningTasks } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import TelegramFollowCard from '../components/TelegramFollowCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Wallet, Pickaxe, TrendingUp, ArrowRight } from 'lucide-react';
import { MiningState } from '../backend';

export default function DashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: miningTasks } = useGetMiningTasks();
  const navigate = useNavigate();

  const balance = userProfile ? Number(userProfile.balance) / 10 : 0;
  const miningCount = userProfile ? Number(userProfile.miningCount) : 0;
  const telegramFollowed = userProfile?.telegramFollowed || false;

  const activeMiningTasks = miningTasks?.filter(([_, task]) => task.state === MiningState.active) || [];
  const totalEarnings = activeMiningTasks.reduce((sum, [_, task]) => {
    const elapsed = Date.now() - Number(task.startTime) / 1_000_000;
    const hoursElapsed = elapsed / (1000 * 60 * 60);
    const earnings = (hoursElapsed / 24) * 2;
    return sum + earnings;
  }, 0);

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your mining overview.</p>
      </div>

      {!telegramFollowed && <TelegramFollowCard />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.toFixed(2)} USDT</div>
            <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mining</CardTitle>
            <Pickaxe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMiningTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toFixed(2)} USDT</div>
            <p className="text-xs text-muted-foreground mt-1">From {miningCount} mining sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Start Mining</CardTitle>
            <CardDescription>Begin earning 2 USDT per day automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/mining' })} className="w-full gap-2">
              Go to Mining
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>Transfer your earnings to your TRC20 wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/withdrawal' })} variant="outline" className="w-full gap-2">
              Go to Withdrawal
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
