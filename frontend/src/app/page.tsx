"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Leaf, Shield, Database, Cpu, Globe, CheckCircle, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Massive Scale) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-32 px-6">
        {/* Background gradient effects */}
        <div className="absolute top-0 w-full h-full overflow-hidden -z-10">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/40 blur-3xl" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200/40 blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto space-y-8"
        >
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.2, duration: 0.5 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4"
          >
             <Leaf className="w-4 h-4" /> 1M1B EcoShield Project
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Compliance <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Made Autonomous.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            Protecting our environment shouldn't require an army of lawyers. 
            Instantly audit your factory's waste output against strict local regulations using our cutting-edge <strong className="font-semibold text-slate-800">Multi-Model Agentic RAG framework</strong>.
          </p>

          <motion.div 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="pt-8"
          >
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-full text-xl font-bold shadow-[0_10px_40px_-10px_rgba(5,150,105,0.7)] transition-all"
            >
              Start Scanning <ChevronRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE MULTI-MODEL ARCHITECTURE (4 Pillars) */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Enterprise Multi-Model Architecture</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We separated ingestion from reasoning. By utilizing the best cloud providers for each specific task, EcoShield achieves 100% accuracy with zero latency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Database className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. IBM Granite</h3>
              <p className="text-slate-600 leading-relaxed">
                Massive document ingestion. We vectorize complex legal PDFs using IBM Watsonx's state-of-the-art multilingual embedding models for high-dimensional semantic search.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Supabase pgvector</h3>
              <p className="text-slate-600 leading-relaxed">
                Persistent storage. Over 1,300+ pages of environmental compliance law are actively managed and instantly searchable via high-speed Cosine Similarity algorithms.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Gemini 2.5 Flash</h3>
              <p className="text-slate-600 leading-relaxed">
                The Logic Engine. Google's incredibly fast generative AI drives our real-time reasoning, extracting hazards and synthesizing strict JSON action plans flawlessly.
              </p>
            </motion.div>

            {/* Pillar 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">4. LangChain AI</h3>
              <p className="text-slate-600 leading-relaxed">
                The autonomous orchestrator. LangChain glues the multi-cloud components together, formulating dynamic retrieval prompts and injecting dense context into the LLM.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. ALIGNMENT TO UN SDGS */}
      <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex-1 space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">Built for a <br/>Sustainable Future</h2>
            <p className="text-xl text-slate-400 font-light max-w-lg">
              EcoShield directly advances the United Nations Sustainable Development Goals by holding massive industries instantly accountable to local laws.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-lg"><CheckCircle className="text-emerald-400"/> Goal 12: Responsible Consumption</li>
              <li className="flex items-center gap-3 text-lg"><CheckCircle className="text-emerald-400"/> Goal 6: Clean Water & Sanitation</li>
              <li className="flex items-center gap-3 text-lg"><CheckCircle className="text-emerald-400"/> Goal 9: Industry & Innovation</li>
            </ul>
          </motion.div>
          
          <div className="flex-1 grid grid-cols-2 gap-6 perspective-1000">
             {/* SDG Cards with 3D Hover Effects */}
             <motion.div whileHover={{ rotateY: -10, rotateX: 10 }} className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
               <Image src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg" fill alt="SDG 12" className="object-cover" />
             </motion.div>
             <motion.div whileHover={{ rotateY: 10, rotateX: 10 }} className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl mt-12">
               <Image src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg" fill alt="SDG 6" className="object-cover" />
             </motion.div>
             <motion.div whileHover={{ rotateY: -10, rotateX: -10 }} className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl -mt-12 col-span-2 w-1/2 mx-auto">
               <Image src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg" fill alt="SDG 9" className="object-cover" />
             </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}
