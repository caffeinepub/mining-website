import LoginButton from '../components/LoginButton';
import { Pickaxe, Wallet, Gift, Shield, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="container relative z-10 flex min-h-[80vh] flex-col items-center justify-center text-center px-4 py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
            <Pickaxe className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">Start Mining Today</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              Crypto Mining Hub
            </span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Earn passive income with automated cryptocurrency mining. Start with just 20 USDT and watch your earnings grow daily.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <LoginButton />
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur">
              <TrendingUp className="h-8 w-8 text-chart-1" />
              <div className="text-2xl font-bold">2 USDT</div>
              <div className="text-sm text-muted-foreground">Daily Earnings</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur">
              <Clock className="h-8 w-8 text-chart-2" />
              <div className="text-2xl font-bold">1-5 Days</div>
              <div className="text-sm text-muted-foreground">Mining Duration</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur">
              <Wallet className="h-8 w-8 text-chart-3" />
              <div className="text-2xl font-bold">20 USDT</div>
              <div className="text-sm text-muted-foreground">Min Withdrawal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of cryptocurrency mining with our automated platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Pickaxe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Automated Mining</CardTitle>
              <CardDescription>
                Set it and forget it. Our system automatically mines for you 24/7, earning 2 USDT per day.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                <Wallet className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle>TRC20 Withdrawals</CardTitle>
              <CardDescription>
                Fast and secure withdrawals to your Binance TRC20 wallet with a minimum of just 20 USDT.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Gift className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle>Telegram Bonus</CardTitle>
              <CardDescription>
                Join our Telegram channel and receive an instant 1.5 USDT bonus to kickstart your mining journey.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Shield className="h-6 w-6 text-chart-3" />
              </div>
              <CardTitle>Secure Platform</CardTitle>
              <CardDescription>
                Built on Internet Computer blockchain with enterprise-grade security for your peace of mind.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <TrendingUp className="h-6 w-6 text-chart-4" />
              </div>
              <CardTitle>Flexible Duration</CardTitle>
              <CardDescription>
                Choose mining periods from 1 to 5 days based on your investment strategy and goals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                <Clock className="h-6 w-6 text-chart-5" />
              </div>
              <CardTitle>Real-Time Tracking</CardTitle>
              <CardDescription>
                Monitor your mining progress and earnings in real-time with our intuitive dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 px-4">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Mining?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users already earning passive income through our automated mining platform.
          </p>
          <LoginButton />
        </div>
      </section>
    </div>
  );
}
