import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import LoginButton from './LoginButton';
import { Button } from './ui/button';
import { Home, Pickaxe, Wallet, Shield } from 'lucide-react';

export default function Header() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <Pickaxe className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Crypto Mining Hub
            </span>
          </button>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/' })}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/mining' })}
                className="gap-2"
              >
                <Pickaxe className="h-4 w-4" />
                Mining
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/withdrawal' })}
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                Withdrawal
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/admin' })}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}
            </nav>
          )}
        </div>

        <LoginButton />
      </div>
    </header>
  );
}
