import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import OrdersPage from "@/pages/orders";
import CRMPage from "@/pages/crm";
import MenuPage from "@/pages/menu";
import SettingsPage from "@/pages/settings";
import DesignSystemPage from "@/pages/design-system";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/crm" component={CRMPage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/design-system" component={DesignSystemPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
