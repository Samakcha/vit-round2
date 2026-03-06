import Link from "next/link";
import { User, Stethoscope, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8 font-sans">
            <div className="max-w-3xl w-full">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 tracking-tight">
                        Healthcare OS
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-2xl mx-auto py-2">
                        Intelligent triage and secure communication platform connecting patients with medical professionals.
                    </p>
                </div>

                {/* Portal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">

                    {/* Patient Portal Card */}
                    <Link href="/patient" className="group block">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 h-full transition-all duration-300 hover:bg-neutral-800 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                <User size={36} className="text-blue-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Patient Portal</h2>
                            <p className="text-neutral-400 mb-8 font-medium">
                                Submit health queries, request appointments, and receive AI-assisted triage responses.
                            </p>

                            <div className="mt-auto flex items-center text-blue-500 font-semibold group-hover:underline decoration-2 underline-offset-4">
                                Enter Portal <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    {/* Doctor Portal Card */}
                    <Link href="/doctor" className="group block">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 h-full transition-all duration-300 hover:bg-neutral-800 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Stethoscope size={36} className="text-indigo-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Doctor Dashboard</h2>
                            <p className="text-neutral-400 mb-8 font-medium">
                                Review patient inquiries, edit AI-drafted responses, and manage critical alerts.
                            </p>

                            <div className="mt-auto flex items-center text-indigo-500 font-semibold group-hover:underline decoration-2 underline-offset-4">
                                Access Dashboard <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>

                </div>

                {/* Footer info */}
                <div className="mt-16 text-center">
                    <p className="text-neutral-600 text-sm font-medium">
                        System Status: <span className="text-green-500">All Services Operational</span> • VitalsPro Demo
                    </p>
                </div>
            </div>
        </div>
    );
}
