import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Checkout from './pages/Checkout';

const Admin = lazy(() => import('./pages/Admin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('zenpay_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

const LazyFallback = (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-muted animate-pulse font-semibold">Loading…</div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={LazyFallback}>
      <Routes>
        <Route path="/" element={<Checkout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin><Admin /></ProtectedAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
