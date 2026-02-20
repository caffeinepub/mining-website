import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import { MiningState, type MiningTask } from '../backend';

interface MiningStatusProps {
  tasks: Array<[bigint, MiningTask]>;
}

export default function MiningStatus({ tasks }: MiningStatusProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mining Status</CardTitle>
          <CardDescription>No mining tasks yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Start your first mining task to see progress here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mining Status</CardTitle>
        <CardDescription>Track your active mining tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(([id, task]) => {
          const startTime = Number(task.startTime) / 1_000_000;
          const durationMs = Number(task.duration) * 24 * 60 * 60 * 1000;
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / durationMs) * 100, 100);
          const hoursElapsed = elapsed / (1000 * 60 * 60);
          const earnings = Math.min((hoursElapsed / 24) * 2, Number(task.duration) * 2);

          const isActive = task.state === MiningState.active && progress < 100;
          const isCompleted = progress >= 100 || task.state === MiningState.expired;

          return (
            <div key={id.toString()} className="space-y-3 p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Task #{id.toString()}</span>
                  <Badge variant={isActive ? 'default' : isCompleted ? 'secondary' : 'outline'}>
                    {isActive ? 'Active' : isCompleted ? 'Completed' : 'Not Started'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {Number(task.duration)} {Number(task.duration) === 1 ? 'Day' : 'Days'}
                </div>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Earnings:</span>
                </div>
                <span className="font-medium text-primary">{earnings.toFixed(2)} USDT</span>
              </div>

              <div className="text-xs text-muted-foreground">
                Started: {new Date(startTime).toLocaleString()}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
