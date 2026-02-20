import { useState } from 'react';
import { useLinkTelegram, useGetTelegramLink } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { SiTelegram } from 'react-icons/si';
import { Gift, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function TelegramFollowCard() {
  const [claimed, setClaimed] = useState(false);
  const { data: telegramLink } = useGetTelegramLink();
  const { mutate: linkTelegram, isPending } = useLinkTelegram();

  const handleClaim = () => {
    linkTelegram(undefined, {
      onSuccess: (success) => {
        if (success) {
          setClaimed(true);
          toast.success('Bonus claimed! 1.5 USDT added to your balance.');
        } else {
          toast.error('Bonus already claimed.');
        }
      },
      onError: (error) => {
        toast.error('Failed to claim bonus: ' + error.message);
      },
    });
  };

  if (claimed) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-chart-1/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Get 1.5 USDT Bonus
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Limited Time
                </span>
              </CardTitle>
              <CardDescription>Join our Telegram channel and claim your bonus</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open(telegramLink || 'https://t.me/Goldhunterfx345', '_blank')}
          >
            <SiTelegram className="h-4 w-4" />
            Open Telegram Channel
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button onClick={handleClaim} disabled={isPending} className="gap-2">
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Claiming...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Claim Bonus
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
