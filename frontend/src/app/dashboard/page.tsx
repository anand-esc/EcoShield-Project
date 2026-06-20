"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle, AlertTriangle, ShieldCheck, ChevronRight, File as FileIcon, X, ArrowLeft, Copy, Check, Printer } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [chemicals, setChemicals] = useState("");
  const [location, setLocation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Client-side cache to prevent duplicate API token usage
  const [cache, setCache] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chemicals || !location) return;

    // API Token Protection: Check cache first
    const cacheKey = `${chemicals.trim().toLowerCase()}-${location.trim().toLowerCase()}`;
    if (cache[cacheKey]) {
      setResult(cache[cacheKey]);
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);
    
    const fileNote = uploadedFile ? `\n\n[Attached File: ${uploadedFile.name}]` : "";
    const finalPayload = chemicals + fileNote;
    
    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chemical_list: finalPayload, location }),
      });
      if (!response.ok) throw new Error("Backend connection failed");
      const data = await response.json();
      
      // Save result to cache to protect tokens
      setCache(prev => ({ ...prev, [cacheKey]: data }));
      setResult(data);
    } catch (error) {
      console.error("Error analyzing compliance:", error);
      setErrorMsg("Failed to connect to the AI backend. Please ensure the server is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    
    const hazardsText = result.hazards_identified.map((h: string) => `• ${h}`).join("\n");
    const checklistText = result.compliance_checklist.map((c: string, i: number) => `${i+1}. ${c}`).join("\n");
    
    const fullText = `ECOSHIELD COMPLIANCE BLUEPRINT\n\n📍 Location: ${location}\n\n⚠️ IDENTIFIED HAZARDS:\n${hazardsText}\n\n✅ ACTION PLAN:\n${checklistText}`;
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Animation variants
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const listItemVariant: any = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800 selection:bg-emerald-200 font-sans relative overflow-hidden print:bg-white print:overflow-visible">
      {/* Animated Background Orbs (Hide in Print) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none print:hidden">
        <motion.div 
          animate={{ 
            x: ["-10%", "5%", "-10%"],
            y: ["-40%", "-35%", "-40%"],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[70%] h-[70%] rounded-full bg-emerald-200/50 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: ["10%", "-5%", "10%"],
            y: ["60%", "55%", "60%"],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[60%] h-[60%] rounded-full bg-teal-200/50 blur-[120px]" 
        />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center min-h-screen justify-center print:py-0 print:min-h-0 print:block">
        
        {/* Navigation (Hide in Print) */}
        <div className="w-full max-w-5xl mb-8 flex justify-start print:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors font-medium">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

        {/* Header (Hide in Print) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4 max-w-2xl print:hidden"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 backdrop-blur-md text-emerald-800 border border-emerald-200 mb-4 shadow-sm">
            <ShieldCheck size={18} />
            <span className="text-sm font-semibold tracking-wide uppercase">Workspace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Compliance Dashboard
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Built with <strong className="font-semibold text-slate-800">IBM Granite</strong> for heavy-duty ingestion, 
            and powered by <strong className="font-semibold text-slate-800">Gemini 2.5 Flash</strong> for lightning-fast compliance reasoning.
          </p>
        </motion.div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start print:block print:w-full print:max-w-full print:m-0 print:p-0">
          
          {/* Left Column: Input Form (Hide in Print) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-xl print:hidden"
          >
            <form onSubmit={handleAnalyze} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600" />
                  Chemicals / Waste Materials
                </label>
                <motion.div 
                  animate={dragActive ? { scale: 1.02 } : { scale: 1 }}
                  className={`relative group border-2 border-dashed rounded-xl transition-all duration-300 ${dragActive ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-slate-300 bg-slate-50 hover:border-emerald-400'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <textarea
                    value={chemicals}
                    onChange={(e) => setChemicals(e.target.value)}
                    maxLength={500}
                    placeholder="Type materials here, or drag & drop a manifest file below... (Max 500 characters)"
                    className="w-full h-32 bg-transparent p-4 text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
                  />
                  
                  {/* File Drop Zone / Display */}
                  <div className="px-4 pb-4">
                    <AnimatePresence mode="wait">
                      {uploadedFile ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-md">
                              <FileIcon size={16} className="text-emerald-700" />
                            </div>
                            <span className="text-sm font-semibold text-emerald-900 truncate max-w-[200px]">{uploadedFile.name}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setUploadedFile(null)}
                            className="p-1 hover:bg-emerald-200 rounded-md text-emerald-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center py-4 border-t border-slate-200 border-dashed cursor-pointer hover:bg-emerald-50/50 rounded-b-lg transition-colors"
                        >
                          <UploadCloud size={20} className={`text-slate-400 mb-2 transition-colors ${dragActive ? 'text-emerald-600' : 'group-hover:text-emerald-500'}`} />
                          <span className="text-xs text-slate-500 font-medium">Click to browse or drag & drop a file</span>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileChange}
                            accept=".pdf,.csv,.txt"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <UploadCloud size={18} className="text-teal-600" />
                  Facility Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={100}
                  placeholder="City, State (e.g., Bangalore, Karnataka)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isAnalyzing}
                className="w-full relative group overflow-hidden rounded-xl p-[1px] shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-white font-bold">
                  {isAnalyzing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Generate Blueprint</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column: Output / Results */}
          <div className={`transition-all duration-700 h-full ${(result || isAnalyzing || errorMsg) ? 'opacity-100 translate-x-0' : 'opacity-100 lg:opacity-100'} print:block print:w-full print:h-auto`}>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-xl h-full flex flex-col relative overflow-hidden min-h-[500px] print:shadow-none print:border-none print:p-0 print:min-h-0 print:bg-white"
            >
              
              {/* Print-Only Header */}
              <div className="hidden print:block mb-8 pb-4 border-b-2 border-slate-900">
                <h1 className="text-3xl font-extrabold text-slate-900">EcoShield Compliance Blueprint</h1>
                <p className="text-slate-600 font-medium mt-2">📍 Location: {location || "Unknown"}</p>
              </div>

              {/* Export Buttons (Hide in Print) */}
              {result && !isAnalyzing && (
                <div className="absolute top-6 right-6 flex gap-2 z-20 print:hidden">
                  <button 
                    onClick={handleCopy}
                    className="p-2.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-2 text-sm font-semibold border border-slate-200 hover:border-emerald-200 shadow-sm"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Text"}</span>
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2 text-sm font-semibold shadow-md"
                    title="Download PDF"
                  >
                    <Printer size={16} />
                    <span className="hidden sm:inline">Save PDF</span>
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {!result && !isAnalyzing && !errorMsg && (
                  <motion.div 
                    key="awaiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 print:hidden"
                  >
                    <ShieldCheck size={56} className="mb-4 opacity-20 text-emerald-500" />
                    <p className="font-medium">Awaiting payload...</p>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 print:hidden"
                  >
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle size={32} className="text-rose-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h3>
                    <p className="text-slate-500 font-medium">{errorMsg}</p>
                  </motion.div>
                )}

                {isAnalyzing && (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600 print:hidden"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full mb-4"
                    />
                    <p className="font-bold animate-pulse">Gemini 2.5 Flash is reasoning...</p>
                  </motion.div>
                )}

                {result && !isAnalyzing && (
                  <motion.div 
                    key="results"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="space-y-8 relative z-10 pt-4 print:pt-0"
                  >
                    
                    {/* Hazards */}
                    <motion.div variants={staggerContainer} className="print:break-inside-avoid">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-rose-600 mb-4 border-b border-slate-100 pb-2 print:text-rose-800 print:border-rose-200">
                        <AlertTriangle size={18} />
                        Identified Hazards
                      </h3>
                      <ul className="space-y-2">
                        {result.hazards_identified.map((hazard: string, idx: number) => (
                          <motion.li key={idx} variants={listItemVariant} className="flex items-start gap-3 text-slate-700 bg-rose-50 p-3 rounded-lg border border-rose-100 print:bg-white print:border-none print:p-1 print:text-slate-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0 shadow-sm print:bg-slate-800 print:shadow-none" />
                            <span className="text-sm font-medium print:text-base">{hazard}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Checklist */}
                    <motion.div variants={staggerContainer}>
                      <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-600 mb-4 border-b border-slate-100 pb-2 print:text-emerald-800 print:border-emerald-200">
                        <CheckCircle size={18} />
                        Compliance Action Plan
                      </h3>
                      <ul className="space-y-3">
                        {result.compliance_checklist.map((item: string, idx: number) => (
                          <motion.li key={idx} variants={listItemVariant} className="flex items-start gap-3 text-slate-800 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors shadow-sm print:bg-white print:border-none print:p-2 print:shadow-none print:hover:border-none">
                            <div className="shrink-0 mt-0.5">
                              <div className="w-5 h-5 rounded-full border border-emerald-400 flex items-center justify-center bg-white print:border-slate-800">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 print:bg-slate-800" />
                              </div>
                            </div>
                            <span className="text-sm leading-relaxed font-medium print:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Citations */}
                    <motion.div variants={listItemVariant} className="pt-4 border-t border-slate-100 print:border-t-2 print:border-slate-800 print:mt-8">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 print:text-slate-900 print:text-sm">Legal Citations (RAG Sources)</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.sources.map((source: string, idx: number) => (
                          <span key={idx} className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-medium print:bg-white print:border print:border-slate-400 print:text-slate-800">
                            {source}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
