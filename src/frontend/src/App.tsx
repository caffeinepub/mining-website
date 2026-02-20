import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerApproved, useIsCallerAdmin } from './hooks/useQueries';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MiningPage from './pages/MiningPage';
import WithdrawalPage from './pages/WithdrawalPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AuthenticatedApp() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const { data: isAdmin } = useIsCallerAdmin();

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;
  const isReady = !profileLoading && !approvalLoading && userProfile !== null;

  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isApproved && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold">Account Pending Approval</h2>
          <p className="text-muted-foreground">
            Your account is currently under review. An administrator will approve your account shortly.
          </p>
          <p className="text-sm text-muted-foreground">
            Please check back later or contact support if you have any questions.
          </p>
        </div>
      </div>
    );
  }

  const rootRoute = createRootRoute({
    component: Layout,
  });

  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: DashboardPage,
  });

  const miningRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/mining',
    component: MiningPage,
  });

  const withdrawalRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/withdrawal',
    component: WithdrawalPage,
  });

  const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminDashboard,
  });

  const routeTree = rootRoute.addChildren([dashboardRoute, miningRoute, withdrawalRoute, adminRoute]);

  const router = createRouter({ routeTree });

  return <RouterProvider router={router} />;
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {identity ? <AuthenticatedApp /> : <LandingPage />}
      <Toaster />
    </ThemeProvider>
  );
}
