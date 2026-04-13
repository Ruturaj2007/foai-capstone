import React, { useContext, useMemo } from 'react';
import { DataContext } from './DashboardLayout';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend 
} from 'chart.js';

const ChartCard = ({ title, children }) => (
  <div className="bg-[#111111] border border-white/5 p-5 rounded-xl flex flex-col min-h-[300px]">
    <h3 className="font-heading font-bold text-white text-md mb-4">{title}</h3>
    <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
      {children}
    </div>
  </div>
);

const Escalations = () => {
  const { data, loading } = useContext(DataContext);

  const escalatedData = useMemo(() => {
    if (!data) return [];
    return data.filter(t => t.escalated).reverse();
  }, [data]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#E4E4E7' } } },
    scales: {
      x: { grid: { color: '#27272a' }, ticks: { color: '#E4E4E7' } },
      y: { grid: { color: '#27272a' }, ticks: { color: '#E4E4E7' } }
    }
  };

  const simpleOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#E4E4E7' } } }
  };

  // 1. Escalated by Topic
  const topics = {};
  escalatedData.forEach(t => { topics[t.topic] = (topics[t.topic] || 0) + 1; });
  const topicData = {
    labels: Object.keys(topics),
    datasets: [{ data: Object.values(topics), backgroundColor: ['#E74C3C', '#F39C12', '#2C2C2C', '#27AE60'], borderWidth: 0 }]
  };

  // 2. Escalated by Priority
  const priorities = {};
  escalatedData.forEach(t => { priorities[t.priority] = (priorities[t.priority] || 0) + 1; });
  const priorData = {
    labels: Object.keys(priorities),
    datasets: [{ label: 'Tickets', data: Object.values(priorities), backgroundColor: '#E74C3C', borderRadius: 4 }]
  };

  // 3. Escalation rate over time
  const datesObj = {};
  escalatedData.forEach(t => {
    if(!t.timestamp) return;
    const d = new Date(t.timestamp).toLocaleDateString();
    datesObj[d] = (datesObj[d] || 0) + 1;
  });
  const sortedDates = Object.keys(datesObj).sort((a,b) => new Date(a) - new Date(b));
  const timeData = {
    labels: sortedDates,
    datasets: [{ label: 'Escalations', data: sortedDates.map(d => datesObj[d]), borderColor: '#E74C3C', tension: 0.3 }]
  };

  if (loading) return <div className="text-zinc-500">Loading escalations...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
        <h2 className="text-xl font-bold font-heading text-red-500">These tickets need human attention</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Escalated by Topic"><Pie data={topicData} options={simpleOptions} /></ChartCard>
        <ChartCard title="Escalated by Priority"><Bar data={priorData} options={chartOptions} /></ChartCard>
        <ChartCard title="Escalation Rate Over Time"><Line data={timeData} options={chartOptions} /></ChartCard>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-[#1a1a1a] text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-medium">Ticket ID</th>
              <th className="px-6 py-4 font-medium">Suggested Team</th>
              <th className="px-6 py-4 font-medium">Customer Mood</th>
              <th className="px-6 py-4 font-medium">Message Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {escalatedData.map((t, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-white">{t.ticket_id}</td>
                <td className="px-6 py-4 capitalize font-semibold text-scaler-red">{t.suggested_team}</td>
                <td className="px-6 py-4 capitalize">{t.mood} {t.sentiment === 'negative' && '⚠️'}</td>
                <td className="px-6 py-4 max-w-sm truncate">{t.message}</td>
              </tr>
            ))}
            {escalatedData.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center">No active escalations.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Escalations;
