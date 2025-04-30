import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UPSCTracker() {
  const [tab, setTab] = useState('daily');
  const [dailyLog, setDailyLog] = useState('');
  const [logs, setLogs] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [goals, setGoals] = useState([]);
  const reminders = [
    "Stay consistent with revision",
    "Attempt mock tests weekly",
    "Track progress on subjects: Polity, History, Geography, etc.",
    "Stay mentally and physically fit",
  ];

  useEffect(() => {
    supabase.from('daily_logs').select('*').order('date', { ascending: false })
      .then(({ data }) => setLogs(data || []));
    supabase.from('monthly_goals').select('*').order('date', { ascending: false })
      .then(({ data }) => setGoals(data || []));
  }, []);

  const addLog = async () => {
    if (!dailyLog.trim()) return;
    const { data } = await supabase.from('daily_logs').insert([{ text: dailyLog, date: new Date().toISOString() }]).select();
    setLogs(prev => [...data, ...prev]);
    setDailyLog('');
  };

  const deleteLog = async (id) => {
    await supabase.from('daily_logs').delete().eq('id', id);
    setLogs(prev => prev.filter(item => item.id !== id));
  };

  const addGoal = async () => {
    if (!monthlyGoal.trim()) return;
    const { data } = await supabase.from('monthly_goals').insert([{ text: monthlyGoal, date: new Date().toISOString() }]).select();
    setGoals(prev => [...data, ...prev]);
    setMonthlyGoal('');
  };

  const deleteGoal = async (id) => {
    await supabase.from('monthly_goals').delete().eq('id', id);
    setGoals(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">🌟 UPSC Prep Tracker</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-6">
          {['daily','monthly','reminders'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded ${tab===t ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
            >
              {t === 'daily' ? '🗓 Daily Log' : t === 'monthly' ? '📅 Monthly Goals' : '⏰ Reminders'}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'daily' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">What did you study today?</h2>
            <textarea
              value={dailyLog}
              onChange={e => setDailyLog(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={3}
              placeholder="e.g., Completed Modern History Revision and solved 25 MCQs"
            />
            <button
              onClick={addLog}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >✅ Submit Log</button>

            <div className="mt-6 space-y-4">
              {logs.map(log => (
                <div key={log.id} className="flex justify-between items-start bg-gray-50 p-3 rounded shadow">
                  <div>
                    <div className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</div>
                    <div className="text-gray-800">{log.text}</div>
                  </div>
                  <button onClick={() => deleteLog(log.id)} className="text-red-500">❌</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'monthly' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Set Your Monthly UPSC Goal</h2>
            <input
              type="text"
              value={monthlyGoal}
              onChange={e => setMonthlyGoal(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="e.g., Finish Laxmikant + 3 full mocks"
            />
            <button
              onClick={addGoal}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >🎯 Save Goal</button>

            <div className="mt-6 space-y-4">
              {goals.map(goal => (
                <div key={goal.id} className="flex justify-between items-start bg-gray-50 p-3 rounded shadow">
                  <div>
                    <div className="text-sm text-gray-500">{new Date(goal.date).toLocaleDateString()}</div>
                    <div className="text-gray-800">{goal.text}</div>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-red-500">❌</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'reminders' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">UPSC Daily Reminders 💡</h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {reminders.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
