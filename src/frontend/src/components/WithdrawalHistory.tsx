import { useGetTransactions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { TransactionState } from '../backend';

export default function WithdrawalHistory() {
  const { data: transactions, isLoading } = useGetTransactions();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Your recent withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Your recent withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No withdrawal requests yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort transactions by ID in descending order (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>Your recent withdrawal requests</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sortedTransactions.map(([id, tx]) => {
              const amount = Number(tx.amount) / 10;
              const isPending = tx.state === TransactionState.pending;
              const isApproved = tx.state === TransactionState.approved;
              const isRejected = tx.state === TransactionState.rejected;

              return (
                <div key={id.toString()} className="space-y-2 p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">#{id.toString()}</span>
                    <Badge
                      variant={isPending ? 'outline' : isApproved ? 'default' : 'destructive'}
                    >
                      {isPending && (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                      {isApproved && (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </>
                      )}
                      {isRejected && (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="text-2xl font-bold text-primary">{amount.toFixed(2)} USDT</div>

                  <div className="text-xs text-muted-foreground break-all">
                    To: {tx.toWallet}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
