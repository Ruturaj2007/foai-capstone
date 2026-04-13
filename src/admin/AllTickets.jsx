import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from './DashboardLayout';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const AllTickets = () => {
  const { data, loading } = useContext(DataContext);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(t => {
      const matchesSearch = t.ticket_id?.toLowerCase().includes(search.toLowerCase()) || 
                            t.message?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    }).reverse();
  }, [data, search]);

  if (loading) return <div className="text-zinc-500">Loading table...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold font-heading text-white">All Tickets</h2>
        
        <div className="relative w-full md:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search ID or message..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-[#111111] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-scaler-red focus:outline-none transition-all text-white"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-[#1a1a1a] text-zinc-300">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket ID</th>
                <th className="px-6 py-4 font-medium">Message Snapshot</th>
                <th className="px-6 py-4 font-medium">Topic</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((t, idx) => (
                <React.Fragment key={idx}>
                  <tr 
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === t.ticket_id ? null : t.ticket_id)}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-white">{t.ticket_id}</td>
                    <td className="px-6 py-4"><div className="truncate max-w-[200px]">{t.message}</div></td>
                    <td className="px-6 py-4 capitalize">{t.topic}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${t.escalated ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {t.escalated ? 'Escalated' : 'Resolved'}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">{t.priority}</td>
                    <td className="px-6 py-4 text-xs">{new Date(t.timestamp).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {expandedId === t.ticket_id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </td>
                  </tr>
                  {expandedId === t.ticket_id && (
                    <tr className="bg-[#0A0A0A] border-l-2 border-scaler-red">
                      <td colSpan={7} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div><strong className="text-white block mb-1">Full Message:</strong><div className="p-3 bg-white/5 rounded-md text-zinc-300">{t.message}</div></div>
                            <div><strong className="text-white block mb-1">AI Customer Reply:</strong><div className="p-3 bg-scaler-red/10 border border-scaler-red/20 rounded-md text-zinc-300">{t.customer_reply}</div></div>
                          </div>
                          <div className="space-y-4">
                            <div><strong className="text-white block mb-1">Ticket Summary:</strong><p>{t.ticket_summary}</p></div>
                            <div className="flex gap-6 mt-4">
                              <div><strong className="text-white block">FAQ Matched:</strong> {t.faq_matched ? 'Yes' : 'No'}</div>
                              <div><strong className="text-white block">Quality Score:</strong> ⭐ {t.response_quality_score}/10</div>
                              <div><strong className="text-white block">Suggested Team:</strong> <span className="capitalize">{t.suggested_team}</span></div>
                            </div>
                            {t.faq_matched && (
                              <div className="mt-4"><strong className="text-white block mb-1">FAQ Answer Source:</strong><p className="p-3 bg-white/5 rounded-md">{t.faq_answer}</p></div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
