"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, CheckCircle, AlertTriangle, User, FileText, Send } from "lucide-react";

export default function DoctorPage() {
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState<any>(null);
    const [editedResponse, setEditedResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://127.0.0.1:8000/doctor/queries");
            setQueries(response.data);
        } catch (error) {
            console.error("Error fetching queries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
        const interval = setInterval(fetchQueries, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleSelectQuery = (query: any) => {
        setSelectedQuery(query);
        setEditedResponse(query.ai_draft || "");
    };

    const handleApprove = async () => {
        if (!selectedQuery) return;
        setSubmitting(true);
        try {
            await axios.put(`http://127.0.0.1:8000/doctor/queries/${selectedQuery.id}/review`, {
                final_response: editedResponse,
            });
            setSelectedQuery(null);
            setEditedResponse("");
            fetchQueries();
        } catch (error) {
            console.error("Error approving query:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 p-8 font-sans flex flex-col md:flex-row gap-8">

            {/* Sidebar: Query List */}
            <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
                <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center">
                        <FileText className="mr-2 text-blue-600" /> IntelliCareAI Inbox
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {queries.length} Pending
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading && queries.length === 0 ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-neutral-400" /></div>
                    ) : queries.length === 0 ? (
                        <p className="text-center text-neutral-500 py-8">No pending queries.</p>
                    ) : (
                        queries.map((q: any) => (
                            <div
                                key={q.id}
                                onClick={() => handleSelectQuery(q)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedQuery?.id === q.id
                                    ? "border-blue-500 bg-blue-50/50 shadow-sm"
                                    : q.status === "critical_alert"
                                        ? "border-red-300 bg-red-50 hover:bg-red-100"
                                        : "border-neutral-200 hover:border-blue-300 hover:bg-neutral-50"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-neutral-900 text-sm flex items-center">
                                        <User size={14} className="mr-1 text-neutral-500" /> {q.patient_id}
                                    </span>
                                    {q.status === "critical_alert" && (
                                        <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">
                                            <AlertTriangle size={12} className="mr-1" /> CRITICAL
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-neutral-600 line-clamp-2">{q.query_text}</p>
                                <div className="mt-3 flex justify-between items-center text-xs text-neutral-400">
                                    <div className="flex space-x-2">
                                        <span className="uppercase tracking-wider font-semibold">{q.intent}</span>
                                        {(q.spo2 || q.bpm) && (
                                            <span className="text-blue-500 font-medium border-l border-neutral-300 pl-2">
                                                {q.spo2 && `SpO2: ${q.spo2}%`} {q.bpm && `BPM: ${q.bpm}`}
                                            </span>
                                        )}
                                    </div>
                                    <span>ID: #{q.id}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content: Review Area */}
            <div className="w-full md:w-2/3 flex flex-col h-[calc(100vh-4rem)]">
                {selectedQuery ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 flex-1 flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className={`p-6 border-b ${selectedQuery.status === 'critical_alert' ? 'bg-red-50 border-red-100' : 'bg-neutral-50 border-neutral-100'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900 flex items-center mb-1">
                                        Reviewing: {selectedQuery.patient_id}
                                    </h3>
                                    <div className="flex space-x-2">
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-neutral-200 text-neutral-700 uppercase">
                                            Intent: {selectedQuery.intent}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Banner */}
                        {selectedQuery.status === 'critical_alert' && (
                            <div className="bg-red-600 text-white p-3 text-sm font-semibold flex items-center justify-center">
                                <AlertTriangle size={16} className="mr-2" />
                                CRUSHING PRIORITY: Hospital Nearby Alerted! Review immediately.
                            </div>
                        )}

                        {/* Body */}
                        <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-6">

                            {/* Patient Vitals (if available) */}
                            {(selectedQuery.spo2 || selectedQuery.bpm) && (
                                <div className="flex space-x-4 bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                                    <div className="flex-1 flex flex-col items-center justify-center p-2 bg-neutral-50 rounded-lg">
                                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">SpO2 Level</span>
                                        <span className={`text-2xl font-bold ${selectedQuery.spo2 < 92 ? 'text-red-600' : 'text-green-600'}`}>
                                            {selectedQuery.spo2 ? `${selectedQuery.spo2}%` : '--'}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center p-2 bg-neutral-50 rounded-lg">
                                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Heart Rate (BPM)</span>
                                        <span className={`text-2xl font-bold ${selectedQuery.bpm > 120 ? 'text-red-600' : 'text-neutral-900'}`}>
                                            {selectedQuery.bpm || '--'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Patient Query Box */}
                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Patient Query</h4>
                                <p className="text-neutral-900 font-medium text-lg leading-relaxed">
                                    "{selectedQuery.query_text}"
                                </p>
                            </div>

                            {/* AI Draft Box */}
                            <div className="flex-1 flex flex-col">
                                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    <span>AI Draft Response</span>
                                    <span className="text-[10px] bg-neutral-100 px-2 py-1 rounded text-neutral-600 lowercase font-normal">Edit before sending</span>
                                </h4>
                                <textarea
                                    value={editedResponse}
                                    onChange={(e) => setEditedResponse(e.target.value)}
                                    className="flex-1 w-full min-h-[300px] p-5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-neutral-800 font-medium leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end">
                            <button
                                onClick={handleApprove}
                                disabled={submitting || !editedResponse.trim()}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-sm flex items-center disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        Sending Response...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Approve & Send to Patient
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 flex-1 flex flex-col items-center justify-center text-neutral-400">
                        <FileText className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Select a query from the inbox to review.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
