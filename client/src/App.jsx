import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { BuyerDashboard } from './pages/Buyer/BuyerDashboard';
import { CreateEditRFQ } from './pages/Buyer/CreateEditRFQ';
import { RFQDetailsBuyer } from './pages/Buyer/RFQDetailsBuyer';
import { SupplierMarketplace } from './pages/Supplier/SupplierMarketplace';
import { RFQDetailsSupplier } from './pages/Supplier/RFQDetailsSupplier';
import { MyQuotations } from './pages/Supplier/MyQuotations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public & General Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/marketplace" element={<SupplierMarketplace />} />
              <Route path="/supplier/rfq/:id" element={<RFQDetailsSupplier />} />

              {/* Buyer Only Protected Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/create-rfq"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <CreateEditRFQ />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/edit-rfq/:id"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <CreateEditRFQ />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/rfq/:id"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <RFQDetailsBuyer />
                  </ProtectedRoute>
                }
              />

              {/* Supplier Only Protected Routes */}
              <Route
                path="/supplier/quotations"
                element={
                  <ProtectedRoute allowedRoles={['supplier']}>
                    <MyQuotations />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
