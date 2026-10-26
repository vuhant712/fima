import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Setup from './pages/Setup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Wallets from './pages/Wallets.jsx';
import Budgets from './pages/Budgets.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import { Privacy, DataDeletion } from './pages/Legal.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
