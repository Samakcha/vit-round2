"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Send, Activity, User, MessageCircle } from "lucide-react";

export default function PatientPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [queries, setQueries] = useState([]);

    // Hardcoded patient ID for demo purposes
    const patientId = "patient_001";

    const fetchQueries = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/patient/${patientId}/queries`);
            setQueries(response.data);
        } catch (error) {
            console.error("Error fetching queries:", error);
        }
    };

    useEffect(() => {
        fetchQueries();
        const interval = setInterval(fetchQueries, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            await axios.post("http://127.0.0.1:8000/query", {
                patient_id: patientId,
                patient_query: query,
            });
            setQuery("");
            fetchQueries();
        } catch (error) {
            console.error("Error submitting query:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">IntelliCareAI Patient</h1>
                            <p className="text-neutral-500">Welcome back, Patient {patientId.split('_')[1]}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-medium text-sm">
                        <Activity size={16} />
                        <span>Health Status: Stable</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Submit Query Panel */}
                    <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-fit">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                            <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                            Ask a Question
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    How can we help you today?
                                </label>
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="E.g., I have a mild headache or I need to reschedule my appointment."
                                    className="w-full p-4 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32 text-neutral-800 placeholder:text-neutral-400"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit Query
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Queries History Panel */}
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 min-h-[500px]">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center border-b border-neutral-100 pb-4">
                            Recent Inquiries
                        </h2>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {queries.length === 0 ? (
                                <div className="text-center text-neutral-400 py-12">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No previous inquiries found.</p>
                                </div>
                            ) : (
                                queries.map((q: any) => (
                                    <div key={q.id} className="border border-neutral-100 rounded-xl p-5 hover:border-blue-100 transition-colors bg-neutral-50/50">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                                                {q.intent || "General"}
                                            </span>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${q.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                                                q.status === 'critical_alert' ? 'bg-red-100 text-red-700 animate-pulse' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {q.status === 'reviewed' ? 'Answered' :
                                                    q.status === 'critical_alert' ? 'Reviewing Immediately' : 'Pending Review'}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-neutral-500 mb-1">You asked:</p>
                                            <p className="text-neutral-800 font-medium">"{q.query_text}"</p>
                                        </div>

                                        {q.final_response ? (
                                            <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                                                <p className="text-sm font-medium text-green-600 mb-1 flex items-center">
                                                    <Activity size={14} className="mr-1" /> Hospital Response:
                                                </p>
                                                <p className="text-neutral-700 text-sm whitespace-pre-wrap">{q.final_response}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white p-4 rounded-lg border border-neutral-100 shadow-sm text-sm text-neutral-500 italic flex items-center">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin text-neutral-400" />
                                                Our medical staff is reviewing your inquiry...
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
