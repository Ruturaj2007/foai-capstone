import React, { useContext, useMemo } from 'react';
import { DataContext } from './DashboardLayout';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const ChartCard = ({ title, children }) => (
  <div className="bg-[#111111] border border-white/5 p-5 rounded-xl flex flex-col min-h-[300px]">
    <h3 className="font-heading font-bold text-white text-md mb-4">{title}</h3>
    <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
      {children}
    </div>
  </div>
);

const FAQPerformance = () => {
  const { data, loading } = useContext(DataContext);

  const { faqData, resolutionRate } = useMemo(() => {
    if (!data) return { faqData: [], resolutionRate: 0 };
    const matched = data.filter(t => t.faq_matched);
    const rate = data.length > 0 ? Math.round((matched.length / data.length) * 100) : 0;
    return { faqData: matched.reverse(), resolutionRate: rate };
  }, [data]);

  const simpleOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#E4E4E7' } } }
  };
  const barOpts = { ...simpleOptions, scales: { x: { grid: { color: '#27272a' }, ticks: { color: '#E4E4E7' } }, y: { grid: { color: '#27272a' }, ticks: { color: '#E4E4E7' } } } };

  // 1. Matches by Topic
  const topics = {};
  faqData.forEach(t => { topics[t.topic] = (topics[t.topic] || 0) + 1; });
  const topicData = {
    labels: Object.keys(topics),
    datasets: [{ label: 'Matches', data: Object.values(topics), backgroundColor: '#27AE60', borderRadius: 4 }]
  };

  // 2. Matched vs Not
  const notMatched = data ? data.length - faqData.length : 0;
  const matchRatio = {
    labels: ['FAQ Matched', 'Unmatched (AI/Human)'],
    datasets: [{ data: [faqData.length, notMatched], backgroundColor: ['#27AE60', '#2C2C2C'], borderWidth: 0 }]
  };

  // 3. Rate over time
  const datesObj = {};
  faqData.forEach(t => {
    if(!t.timestamp) return;
    const d = new Date(t.timestamp).toLocaleDateString();
    datesObj[d] = (datesObj[d] || 0) + 1;
  });
  const sortedDates = Object.keys(datesObj).sort((a,b) => new Date(a) - new Date(b));
  const timeData = {
    labels: sortedDates,
    datasets: [{ label: 'FAQ Resolutions', data: sortedDates.map(d => datesObj[d]), borderColor: '#27AE60', tension: 0.3 }]
  };

  if (loading) return <div className="text-zinc-500">Loading FAQ metrics...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#111111] border border-white/5 p-6 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">FAQ Intelligence Layer</h2>
          <p className="text-zinc-400 text-sm">Tickets resolved directly via pre-programmed knowledge</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-heading font-bold text-green-500">{resolutionRate}%</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Resolution Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ChartCard title="FAQ Matches by Topic"><Bar data={topicData} options={barOpts} /></ChartCard>
        <ChartCard title="FAQ Knowledge Utilization"><Doughnut data={matchRatio} options={simpleOptions} /></ChartCard>
        <ChartCard title="FAQ Resolution Over Time"><Line data={timeData} options={barOpts} /></ChartCard>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-[#1a1a1a] text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-medium">Ticket ID</th>
              <th className="px-6 py-4 font-medium">Original Message</th>
              <th className="px-6 py-4 font-medium">Served FAQ Answer</th>
              <th className="px-6 py-4 font-medium">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {faqData.map((t, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-white">{t.ticket_id}</td>
                <td className="px-6 py-4 max-w-xs truncate">{t.message}</td>
                <td className="px-6 py-4 max-w-sm"><div className="truncate text-green-400">{t.faq_answer}</div></td>
                <td className="px-6 py-4">⭐ {t.response_quality_score}/10</td>
              </tr>
            ))}
             {faqData.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center">No FAQ matches found yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FAQPerformance;
