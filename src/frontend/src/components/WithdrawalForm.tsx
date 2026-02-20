import { useState } from 'react';
import { useRequestWithdrawal, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function WithdrawalForm() {
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutate: requestWithdrawal, isPending } = useRequestWithdrawal();

  const balance = userProfile ? Number(userProfile.balance) / 10 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress.trim()) {
      toast.error('Please enter your TRC20 wallet address');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 20) {
      toast.error('Minimum withdrawal amount is 20 USDT');
      return;
    }

    if (amountNum > balance) {
      toast.error('Insufficient balance');
      return;
    }

    const amountBigInt = BigInt(Math.floor(amountNum * 10));

    requestWithdrawal(
      { walletAddress: walletAddress.trim(), amount: amountBigInt },
      {
        onSuccess: (message) => {
          toast.success(message || 'Withdrawal request submitted successfully!');
          setWalletAddress('');
          setAmount('');
        },
        onError: (error) => {
          toast.error(error.message || 'Withdrawal request failed');
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>Withdraw to your TRC20 wallet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">TRC20 Wallet Address</Label>
            <Input
              id="wallet"
              placeholder="Enter your TRC20 address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={isPending}
            />
            <div className="flex items-center gap-2 mt-2">
              <img src="/assets/generated/trc20-badge.dim_128x128.png" alt="TRC20" className="h-6 w-6" />
              <span className="text-xs text-muted-foreground">Binance TRC20 network only</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDT)</Label>
            <Input
              id="amount"
              type="number"
              step="0.1"
              min="20"
              placeholder="Minimum 20 USDT"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Available balance: {balance.toFixed(2)} USDT
            </p>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                Processing...
              </>
            ) : (
              'Request Withdrawal'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
