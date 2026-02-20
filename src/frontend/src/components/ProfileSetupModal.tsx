import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const profile: UserProfile = {
      wallet: name.trim(),
      balance: BigInt(0),
      miningCount: BigInt(0),
      telegramFollowed: false,
    };

    saveProfile(profile, {
      onSuccess: () => {
        toast.success('Profile created successfully!');
      },
      onError: (error) => {
        toast.error('Failed to create profile: ' + error.message);
      },
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Crypto Mining Hub</DialogTitle>
          <DialogDescription>
            Please enter your name to complete your profile setup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
