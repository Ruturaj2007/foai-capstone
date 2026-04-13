import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from './DashboardLayout';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend 
} from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-[#111111] border border-white/5 p-5 rounded-xl flex flex-col min-h-[350px]">
    <div className="mb-4">
      <h3 className="font-heading font-bold text-white text-lg">{title}</h3>
      <p className="text-zinc-500 text-xs mt-1">{subtitle}</p>
    </div>
    <div className="relative flex-1 flex items-center justify-center min-h-[250px] w-full">
      {children}
    </div>
  </div>
);

const Overview = () => {
  const { data, loading } = useContext(DataContext);
  const [dateRange, setDateRange] = useState('all');

  const filteredData = useMemo(() => {
    if (loading || !data) return [];
    if (dateRange === 'all') return data;
    
    const now = new Date();
    const days = parseInt(dateRange);
    return data.filter(t => {
      const d = new Date(t.timestamp);
      return (now - d) / (1000 * 60 * 60 * 24) <= days;
    });
  }, [data, dateRange, loading]);

  // Metrics
  const total = filteredData.length;
  const resolved = filteredData.filter(t => !t.escalated).length;
  const escalated = filteredData.filter(t => t.escalated).length;
  const faqMatched = filteredData.filter(t => t.faq_matched).length;

  // Global options
  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#E4E4E7' }, position: 'bottom' } },
    scales: {
      x: { grid: { color: '#27272a' }, ticks: { color: '#E4E4E7' } },
      y: { grid: { color: '#27272a' }, ticks: { color: '#E4E4E7' } }
    }
  };
  const simpleOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#E4E4E7' } } } };
  const hBarOptions = { ...chartOptions, indexAxis: 'y' };

  // Generate Data Wrappers
  const getCounts = (key) => {
    const res = {};
    filteredData.forEach(t => { const v = t[key]; if(v) res[v] = (res[v] || 0) + 1; });
    return res;
  };

  const datesObj = {};
  const scoresObj = {};
  filteredData.forEach(t => {
    if(!t.timestamp) return;
    const d = new Date(t.timestamp).toLocaleDateString();
    datesObj[d] = (datesObj[d] || 0) + 1;
    if (t.response_quality_score) {
      if(!scoresObj[d]) scoresObj[d] = {sum:0, count:0};
      scoresObj[d].sum += Number(t.response_quality_score);
      scoresObj[d].count += 1;
    }
  });
  const sortedDates = Object.keys(datesObj).sort((a,b) => new Date(a) - new Date(b));

  const topics = getCounts('topic');
  const sentiments = getCounts('sentiment');
  const urgency = getCounts('urgency');
  const teams = getCounts('suggested_team');
  const priorities = getCounts('priority');

  const resolutionData = { labels: ['Resolved', 'Escalated', 'FAQ Matched'], datasets: [{ data: [resolved, escalated, faqMatched], backgroundColor: ['#27AE60', '#E74C3C', '#F39C12'], borderWidth:0 }] };
  const topicData = { labels: Object.keys(topics), datasets: [{ label: 'Tickets', data: Object.values(topics), backgroundColor: '#E74C3C', borderRadius:4 }] };
  const sentimentData = { labels: Object.keys(sentiments), datasets: [{ data: Object.values(sentiments), backgroundColor: ['#F39C12', '#27AE60', '#E74C3C'], borderWidth:0 }] };
  const timeData = { labels: sortedDates, datasets: [{ label: 'Ticket Volume', data: sortedDates.map(d => datesObj[d]), borderColor: '#E74C3C', backgroundColor: 'rgba(231,76,60,0.1)', fill: true }] };
  
  const urgencyData = { labels: Object.keys(urgency).sort(), datasets: [{ label: 'Tickets', data: Object.keys(urgency).sort().map(k => urgency[k]), backgroundColor: '#F39C12', borderRadius:4 }] };
  const priorData = { labels: Object.keys(priorities), datasets: [{ label: 'Tickets', data: Object.values(priorities), backgroundColor: ['#27AE60', '#F39C12', '#E74C3C', '#8E44AD'], borderRadius:4 }] };
  const teamData = { labels: Object.keys(teams), datasets: [{ label: 'Tickets Routed', data: Object.values(teams), backgroundColor: '#2C2C2C', borderRadius:4 }] };
  const qualityData = { labels: sortedDates, datasets: [{ label: 'Avg Quality / 10', data: sortedDates.map(d => scoresObj[d] ? (scoresObj[d].sum/scoresObj[d].count).toFixed(1) : null), borderColor: '#27AE60', tension: 0.3 }] };

  if (loading) return <div className="text-zinc-500">Loading metrics...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading text-white">Platform Overview</h2>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-[#111111] text-zinc-300 border border-white/10 rounded-lg px-4 py-2 focus:border-scaler-red outline-none hidden sm:block">
          <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="all">All time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tickets', value: total, c: 'text-zinc-100' },
          { label: 'Resolved by AI', value: resolved, c: 'text-green-500' },
          { label: 'Escalated to Human', value: escalated, c: 'text-scaler-red' },
          { label: 'FAQ Matched', value: faqMatched, c: 'text-yellow-500' },
        ].map((m, idx) => (
          <div key={idx} className="bg-[#111111] border border-white/5 p-6 rounded-xl">
            <div className="text-zinc-400 text-sm font-medium mb-2">{m.label}</div>
            <div className={`text-4xl font-heading font-bold ${m.c}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Resolution Distribution" subtitle="AI vs Human Escalation vs FAQ"><Pie data={resolutionData} options={simpleOptions} /></ChartCard>
        <ChartCard title="Tickets by Topic" subtitle="Categorized volume"><Bar data={topicData} options={chartOptions} /></ChartCard>
        <ChartCard title="Tickets Over Time" subtitle="Volume by date"><Line data={timeData} options={chartOptions} /></ChartCard>
        <ChartCard title="Sentiment Breakdown" subtitle="Customer emotional state"><Doughnut data={sentimentData} options={simpleOptions} /></ChartCard>
        
        <ChartCard title="Urgency Distribution" subtitle="Customer declared urgency (1-5)"><Bar data={urgencyData} options={chartOptions} /></ChartCard>
        <ChartCard title="Routed by Team" subtitle="Intelligent team dispatch"><Bar data={teamData} options={hBarOptions} /></ChartCard>
        <ChartCard title="Priority Scope" subtitle="Internal priority labels"><Bar data={priorData} options={chartOptions} /></ChartCard>
        <ChartCard title="Response Quality" subtitle="Avg AI response rating"><Line data={qualityData} options={chartOptions} /></ChartCard>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden mt-8">
        <div className="p-5 border-b border-white/5"><h3 className="font-heading font-bold text-white text-lg">Recent Tickets</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-[#1a1a1a] text-zinc-300">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket ID</th><th className="px-6 py-4 font-medium">Message</th><th className="px-6 py-4 font-medium">Topic</th><th className="px-6 py-4 font-medium">Mood</th><th className="px-6 py-4 font-medium">Priority</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.slice(-10).reverse().map((t, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{t.ticket_id}</td>
                  <td className="px-6 py-4"><div className="truncate w-[150px]">{t.message}</div></td>
                  <td className="px-6 py-4 capitalize">{t.topic}</td>
                  <td className="px-6 py-4 capitalize">{t.mood}</td>
                  <td className="px-6 py-4 capitalize">{t.priority}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${t.escalated ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>{t.escalated ? 'Escalated' : 'Resolved'}</span></td>
                  <td className="px-6 py-4 text-xs">{new Date(t.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
