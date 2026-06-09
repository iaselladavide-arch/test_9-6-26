import { useAuth } from '../context/AuthContext';
import { DipendenteDashboard } from '../components/DipendenteDashboard';
import { ResponsabileDashboard } from '../components/ResponsabileDashboard';
import '../styles/Dashboard.css';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="user-info">Benvenuto, {user?.nome} {user?.cognome} ({user?.ruolo})</p>
      </div>

      {user?.ruolo === 'Dipendente' ? (
        <DipendenteDashboard />
      ) : (
        <ResponsabileDashboard />
      )}
    </div>
  );
}
