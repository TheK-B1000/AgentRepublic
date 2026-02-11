import { Route, Switch } from 'wouter';
import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MissionControl } from './components/MissionControl';
import { TraceFeed } from './components/TraceFeed'; // Correct import name
import { NotFound } from './components/ui/not-found-2';
import { LandingPage } from './pages/LandingPage';
import ShaderDemo from './pages/ShaderDemo'; // Default import

// Dashboard layout wrapper
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative selection:bg-cyan-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-background to-background pointer-events-none" />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto sm:p-6 p-4 scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Switch>
      {/* Marketing Site */}
      <Route path="/" component={LandingPage} />

      {/* Dashboard Routes */}
      <Route path="/dashboard">
        <DashboardLayout>
          <MissionControl />
        </DashboardLayout>
      </Route>

      <Route path="/traces">
        <DashboardLayout>
          <div className="glass-panel p-6 rounded-xl border-border/50">
            <h2 className="text-xl font-bold mb-4 gradient-text">Trace History</h2>
            {/* Note: TraceFeed requires logs prop, here we're just showing static/empty for now or need to wire up */}
            <div className="text-muted-foreground">Select a run to view traces (Implementation pending)</div>
          </div>
        </DashboardLayout>
      </Route>

      {/* Demos */}
      <Route path="/demo" component={ShaderDemo} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
