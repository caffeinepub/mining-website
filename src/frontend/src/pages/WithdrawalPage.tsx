import WithdrawalForm from '../components/WithdrawalForm';
import WithdrawalHistory from '../components/WithdrawalHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export default function WithdrawalPage() {
  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Withdrawal</h1>
        <p className="text-muted-foreground">Withdraw your earnings to your TRC20 wallet.</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>
          Minimum withdrawal amount is 20 USDT. Only TRC20 (Binance) network addresses are supported.
          Withdrawals are processed manually and may take up to 24 hours.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WithdrawalForm />
        <WithdrawalHistory />
      </div>
    </div>
  );
}
