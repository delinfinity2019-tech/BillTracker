
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, Bill, Role, BillStatus } from './types';
import { authService } from './services/authService';
import { billService } from './services/billService';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BillsList from './pages/BillsList';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import BillFormModal from './components/BillFormModal';

// Mock components for other routes
const HistoryPlaceholder = () => (
  <div className="py-20 text-center">
    <h2 className="text-2xl font-bold text-slate-800">Payment History</h2>
    <p className="text-slate-500">Coming soon in the next major update.</p>
  </div>
);

const AppRoutes = ({ 
  user, 
  bills, 
  handleLogin, 
  handleLogout, 
  handleRegister, 
  handlePayBill, 
  openAddModal, 
  openEditModal 
}: any) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? (
          <Login 
            onLogin={handleLogin} 
            onNavigateToRegister={() => navigate('/register')} 
          />
        ) : <Navigate to="/dashboard" />} 
      />

      <Route 
        path="/register" 
        element={!user ? (
          <Register 
            onRegister={handleRegister} 
            onNavigateToLogin={() => navigate('/login')} 
          />
        ) : <Navigate to="/dashboard" />} 
      />
      
      <Route
        path="/"
        element={user ? (
          <Layout user={user} onLogout={handleLogout} onAddBill={openAddModal}>
            <Dashboard bills={bills} onPay={handlePayBill} onEdit={openEditModal} />
          </Layout>
        ) : <Navigate to="/login" />}
      />

      <Route
        path="/dashboard"
        element={user ? (
          <Layout user={user} onLogout={handleLogout} onAddBill={openAddModal}>
            <Dashboard bills={bills} onPay={handlePayBill} onEdit={openEditModal} />
          </Layout>
        ) : <Navigate to="/login" />}
      />

      <Route
        path="/bills"
        element={user ? (
          <Layout user={user} onLogout={handleLogout} onAddBill={openAddModal}>
            <BillsList bills={bills} onPay={handlePayBill} onEdit={openEditModal} onAdd={openAddModal} />
          </Layout>
        ) : <Navigate to="/login" />}
      />

      <Route
        path="/history"
        element={user ? (
          <Layout user={user} onLogout={handleLogout} onAddBill={openAddModal}>
            <HistoryPlaceholder />
          </Layout>
        ) : <Navigate to="/login" />}
      />

      <Route
        path="/admin"
        element={user?.role === Role.ADMIN ? (
          <Layout user={user} onLogout={handleLogout}>
            <AdminDashboard allUsers={JSON.parse(localStorage.getItem('bt_all_users') || '[]')} allBills={JSON.parse(localStorage.getItem('bt_bills') || '[]')} />
          </Layout>
        ) : <Navigate to="/dashboard" />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | undefined>();

  useEffect(() => {
    authService.initialize();
    billService.initialize();
    
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadBills(currentUser.id);
    }
    setIsLoading(false);
  }, []);

  const loadBills = (userId: string) => {
    const data = billService.getBills(userId);
    setBills(data);
  };

  const handleLogin = (email: string) => {
    const loggedInUser = authService.login(email);
    if (loggedInUser) {
      setUser(loggedInUser);
      loadBills(loggedInUser.id);
    } else {
      alert('Invalid email or account is inactive.');
    }
  };

  const handleRegister = (data: { fullName: string; email: string; phone: string }) => {
    const newUser = authService.register(data);
    setUser(newUser);
    loadBills(newUser.id);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handlePayBill = (bill: Bill) => {
    billService.markAsPaid(bill.id, bill.amount);
    loadBills(user!.id);
  };

  const handleAddOrUpdateBill = (billData: Partial<Bill>) => {
    if (editingBill) {
      billService.updateBill(editingBill.id, billData);
    } else {
      billService.addBill({ ...billData, userId: user!.id });
    }
    setIsModalOpen(false);
    setEditingBill(undefined);
    loadBills(user!.id);
  };

  const openAddModal = () => {
    setEditingBill(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (bill: Bill) => {
    setEditingBill(bill);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <AppRoutes 
        user={user} 
        bills={bills} 
        handleLogin={handleLogin} 
        handleLogout={handleLogout} 
        handleRegister={handleRegister} 
        handlePayBill={handlePayBill} 
        openAddModal={openAddModal} 
        openEditModal={openEditModal} 
      />

      <BillFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBill(undefined); }} 
        onSubmit={handleAddOrUpdateBill}
        initialData={editingBill}
      />
    </HashRouter>
  );
};

export default App;
