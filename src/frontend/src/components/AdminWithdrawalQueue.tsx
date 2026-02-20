import { useGetAllTransactions, useApproveWithdrawal, useRejectWithdrawal } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { TransactionState } from '../backend';

export default function AdminWithdrawalQueue() {
  const { data: transactions, isLoading } = useGetAllTransactions();
  const { mutate: approveWithdrawal, isPending: isApproving } = useApproveWithdrawal();
  const { mutate: rejectWithdrawal, isPending: isRejecting } = useRejectWithdrawal();

  const handleApprove = (id: bigint) => {
    approveWithdrawal(id, {
      onSuccess: (message) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error('Failed to approve: ' + error.message);
      },
    });
  };

  const handleReject = (id: bigint) => {
    rejectWithdrawal(id, {
      onSuccess: (message) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error('Failed to reject: ' + error.message);
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Queue</CardTitle>
          <CardDescription>Manage pending withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingTransactions = transactions?.filter(([_, tx]) => tx.state === TransactionState.pending) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Queue</CardTitle>
        <CardDescription>
          {pendingTransactions.length} pending withdrawal{pendingTransactions.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No pending withdrawals</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map(([id, tx]) => {
                const amount = Number(tx.amount) / 10;
                const isPending = tx.state === TransactionState.pending;

                return (
                  <TableRow key={id.toString()}>
                    <TableCell className="font-medium">#{id.toString()}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {tx.user.toString().slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-bold">{amount.toFixed(2)} USDT</TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate">
                      {tx.toWallet}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isPending ? 'outline' : tx.state === TransactionState.approved ? 'default' : 'destructive'}>
                        {tx.state === TransactionState.pending && 'Pending'}
                        {tx.state === TransactionState.approved && 'Approved'}
                        {tx.state === TransactionState.rejected && 'Rejected'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isPending && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(id)}
                            disabled={isApproving || isRejecting}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(id)}
                            disabled={isApproving || isRejecting}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
