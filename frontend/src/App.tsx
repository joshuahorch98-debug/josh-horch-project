import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { NewsFeed } from './pages/NewsFeed';
import { Alerts } from './pages/Alerts';
import { Reports } from './pages/Reports';
import { PublicPortal } from './pages/PublicPortal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-background cyber-grid">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 hex-pattern">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/public" element={<PublicPortal />} />
                <Route path="/news" element={<NewsFeed />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/analytics" element={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center cyber-glow">
                        <span className="text-primary text-2xl">📊</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gradient">Analytics Module</h2>
                      <p className="text-muted-foreground">Coming Soon</p>
                    </div>
                  </div>
                } />
                <Route path="/settings" element={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center cyber-glow">
                        <span className="text-primary text-2xl">⚙️</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gradient">Settings</h2>
                      <p className="text-muted-foreground">Coming Soon</p>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-card border border-primary/20 text-foreground cyber-glow',
            duration: 4000,
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
