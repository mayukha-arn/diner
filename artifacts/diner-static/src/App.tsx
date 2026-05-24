import { Switch, Route, Router as WouterRouter } from "wouter";
import HomePage from "@/pages/home";
import OrdersPage from "@/pages/orders";
import CRMPage from "@/pages/crm";
import MenuPage from "@/pages/menu";
import SettingsPage from "@/pages/settings";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        <p className="font-sans text-muted-foreground mt-2">Page not found.</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/crm" component={CRMPage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
