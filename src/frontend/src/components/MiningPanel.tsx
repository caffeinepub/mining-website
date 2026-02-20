import { useState } from 'react';
import { useStartMining } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Pickaxe, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function MiningPanel() {
  const [duration, setDuration] = useState('1');
  const { mutate: startMining, isPending } = useStartMining();

  const handleStartMining = () => {
    const durationDays = BigInt(duration);
    startMining(durationDays, {
      onSuccess: (message) => {
        toast.success(message);
      },
      onError: (error) => {
        toast.error('Failed to start mining: ' + error.message);
      },
    });
  };

  const earnings = Number(duration) * 2;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <img src="/assets/generated/mining-icon.dim_256x256.png" alt="Mining" className="h-8 w-8" />
          </div>
          <div>
            <CardTitle>Start Mining</CardTitle>
            <CardDescription>Choose duration and begin earning</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Mining Duration</Label>
          <RadioGroup value={duration} onValueChange={setDuration}>
            {[1, 2, 3, 4, 5].map((days) => (
              <div key={days} className="flex items-center space-x-2">
                <RadioGroupItem value={days.toString()} id={`duration-${days}`} />
                <Label htmlFor={`duration-${days}`} className="cursor-pointer flex-1">
                  <div className="flex items-center justify-between">
                    <span>{days} {days === 1 ? 'Day' : 'Days'}</span>
                    <span className="text-sm text-muted-foreground">
                      Earn {days * 2} USDT
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily Rate:</span>
            <span className="font-medium">2 USDT/day</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{duration} {duration === '1' ? 'Day' : 'Days'}</span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between">
            <span className="font-medium">Total Earnings:</span>
            <span className="text-lg font-bold text-primary">{earnings} USDT</span>
          </div>
        </div>

        <Button onClick={handleStartMining} disabled={isPending} className="w-full gap-2" size="lg">
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Starting Mining...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Mining
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
