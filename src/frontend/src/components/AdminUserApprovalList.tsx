import { useListApprovals, useSetApproval } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUserApprovalList() {
  const { data: approvals, isLoading } = useListApprovals();
  const { mutate: setApproval, isPending } = useSetApproval();

  const handleApprove = (principal: any) => {
    setApproval(
      { user: principal, status: { approved: null } },
      {
        onSuccess: () => {
          toast.success('User approved successfully');
        },
        onError: (error) => {
          toast.error('Failed to approve user: ' + error.message);
        },
      }
    );
  };

  const handleReject = (principal: any) => {
    setApproval(
      { user: principal, status: { rejected: null } },
      {
        onSuccess: () => {
          toast.success('User rejected');
        },
        onError: (error) => {
          toast.error('Failed to reject user: ' + error.message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Approvals</CardTitle>
          <CardDescription>Manage user access requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingApprovals = approvals?.filter((approval) => 'pending' in approval.status) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Approvals</CardTitle>
        <CardDescription>
          {pendingApprovals.length} pending approval{pendingApprovals.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No pending user approvals</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Principal ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals?.map((approval) => {
                const isPending = 'pending' in approval.status;
                const isApproved = 'approved' in approval.status;
                const isRejected = 'rejected' in approval.status;

                return (
                  <TableRow key={approval.principal.toString()}>
                    <TableCell className="font-mono text-xs">
                      {approval.principal.toString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isPending ? 'outline' : isApproved ? 'default' : 'destructive'}>
                        {isPending && 'Pending'}
                        {isApproved && 'Approved'}
                        {isRejected && 'Rejected'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isPending && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(approval.principal)}
                            disabled={isPending}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(approval.principal)}
                            disabled={isPending}
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
