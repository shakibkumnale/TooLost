import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import Releases from './pages/Releases';
import CreateRelease from './pages/CreateRelease';
import ReleaseDetail from './pages/ReleaseDetail';
import ReleaseTracks from './pages/ReleaseTracks';
import Analytics from './pages/Analytics';
import TrackAnalytics from './pages/TrackAnalytics';
import Sales from './pages/Sales';
import { SalesTrackList, SalesReleaseList, SalesArtistList, SalesChannelList, SalesTerritories, StreamRates } from './pages/SalesSubPages';
import Preferences from './pages/Preferences';
import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/api/auth/toolost/callback" element={<Callback />} />

              {/* Protected routes with layout */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Releases */}
                <Route path="/releases" element={<Releases />} />
                <Route path="/releases/new" element={<CreateRelease />} />
                <Route path="/releases/:id" element={<ReleaseDetail />} />
                <Route path="/releases/:id/tracks" element={<ReleaseTracks />} />

                {/* Analytics */}
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/analytics/tracks/:id" element={<TrackAnalytics />} />

                {/* Sales */}
                <Route path="/sales" element={<Sales />}>
                  <Route path="tracks" element={<SalesTrackList />} />
                  <Route path="releases" element={<SalesReleaseList />} />
                  <Route path="artists" element={<SalesArtistList />} />
                  <Route path="channels" element={<SalesChannelList />} />
                  <Route path="territories" element={<SalesTerritories />} />
                  <Route path="stream-rates" element={<StreamRates />} />
                </Route>

                {/* Preferences & Settings */}
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
