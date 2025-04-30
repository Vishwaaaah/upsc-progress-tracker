import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const supabase = createClient(
  "https://dvwexmbhmcpakpatrbel.supabase.co", // replace with your Supabase project URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d2V4bWJobWNwYWtwYXRyYmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMzQxMzIsImV4cCI6MjA2MTYxMDEzMn0.mIdtToI61BXIUyB4rsLc6LXh9ynDFLVD0Lu9jRNZv5Q" // replace with your Supabase anon public key
);

export default function UPSCTracker() {
  const [dailyLog, setDailyLog] = useState("");
  const [logs, setLogs] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [reminders] = useState([
    "Stay consistent with revision",
    "Attempt mock tests weekly",
    "Track progress on subjects: Polity, History, Geography, etc.",
    "Stay mentally and physically fit",
  ]);

  useEffect(() => {
    fetchLogs();
    fetchGoals();
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase.from("daily_logs").select("*").order("date", { ascending: false });
    setLogs(data || []);
  };

  const fetchGoals = async () => {
    const { data } = await supabase.from("monthly_goals").select("*").order("date", { ascending: false });
    setGoals(data || []);
  };

  const handleLogSubmit = async () => {
    if (dailyLog.trim()) {
      const newLog = { text: dailyLog, date: new Date().toISOString() };
      const { data } = await supabase.from("daily_logs").insert([newLog]).select();
      setLogs([...(data || []), ...logs]);
      setDailyLog("");
    }
  };

  const handleGoalSubmit = async () => {
    if (monthlyGoal.trim()) {
      const newGoal = { text: monthlyGoal, date: new Date().toISOString() };
      const { data } = await supabase.from("monthly_goals").insert([newGoal]).select();
      setGoals([...(data || []), ...goals]);
      setMonthlyGoal("");
    }
  };

  const handleDeleteLog = async (id) => {
    await supabase.from("daily_logs").delete().eq("id", id);
    setLogs(logs.filter((log) => log.id !== id));
  };

  const handleDeleteGoal = async (id) => {
    await supabase.from("monthly_goals").delete().eq("id", id);
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">🌟 UPSC Prep Tracker</h1>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4 bg-white rounded-xl shadow p-2 mb-6">
            <TabsTrigger value="daily" className="rounded-xl">🗓 Daily Log</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-xl">📅 Monthly Goals</TabsTrigger>
            <TabsTrigger value="reminder" className="rounded-xl">⏰ Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-700">What did you study today?</h2>
                <Textarea
                  className="mb-4"
                  value={dailyLog}
                  onChange={(e) => setDailyLog(e.target.value)}
                  placeholder="e.g., Completed Modern History Revision and solved 25 MCQs"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleLogSubmit}>
                  ✅ Submit Log
                </Button>

                <div className="mt-6 space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="bg-white border-l-4 border-purple-500 p-3 shadow rounded flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{new Date(log.date).toLocaleDateString()}</div>
                        <div className="text-gray-800">{log.text}</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteLog(log.id)}>
                        ❌
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-700">Set Your Monthly UPSC Goal</h2>
                <Input
                  className="mb-4"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  placeholder="e.g., Finish Laxmikant + 3 full mocks"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGoalSubmit}>
                  🎯 Save Goal
                </Button>

                <div className="mt-6 space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="bg-blue-50 border-l-4 border-blue-500 p-3 shadow rounded flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{new Date(goal.date).toLocaleDateString()}</div>
                        <div className="text-gray-800">{goal.text}</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteGoal(goal.id)}>
                        ❌
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminder">
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-700">UPSC Daily Reminders 💡</h2>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  {reminders.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div> 
  );
}
