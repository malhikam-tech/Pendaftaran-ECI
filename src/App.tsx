/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Target, Users, BookOpen, 
  MapPin, Globe, Sparkles, MessageSquare, ShieldAlert, RefreshCw
} from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import FormRegistration from './components/FormRegistration';
import SuccessView from './components/SuccessView';
import AdminPanel from './components/AdminPanel';
import RulesEci from './components/RulesEci';
import { RegistrationForm, RegistrationRecord } from './types';
import { insertRegistration } from './lib/supabaseService';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [record, setRecord] = useState<RegistrationRecord | null>(null);
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'rules'>('public');

  // Load persistence from local storage on bootstrap
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eci_registration_record');
      if (saved) {
        setRecord(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Gagal membaca database registrasi lokal:", e);
    }
  }, []);

  const handleRegistrationSubmit = async (formData: RegistrationForm) => {
    setIsSaving(true);
    // Generate a beautiful, unique registration ID
    // Format: ECI-YYYY-RANDOM_HEX
    const today = new Date('2026-05-21'); // Consistent local timestamp
    const yearCode = today.getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(); // Elegant 4-digit ID
    const generatedId = `ECI-${yearCode}-${randomHex}`;

    // Registration date format
    const registrationDateStr = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newRecord: RegistrationRecord = {
      ...formData,
      id: generatedId,
      registrationDate: registrationDateStr
    };

    // Save to Supabase (primary database)
    const dbSaved = await insertRegistration(newRecord);
    if (!dbSaved) {
      console.warn("Peringatan: Gagal mengunggah ke database online Supabase. Data disimpan secara lokal di browser Anda.");
    }

    // Save to local storage for persistence
    try {
      localStorage.setItem('eci_registration_record', JSON.stringify(newRecord));
    } catch (err) {
      console.error("Gagal menyimpan ke database lokal:", err);
    }

    setRecord(newRecord);
    setIsSaving(false);
  };

  const handleResetRecord = () => {
    try {
      localStorage.removeItem('eci_registration_record');
    } catch (err) {
      console.error("Gagal menghapus data lama:", err);
    }
    setRecord(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-smooth relative selection:bg-sky-500/10 selection:text-sky-600">
      
      {/* 3-Second Loading Screen */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Web Application Frame */}
      {!loading && (
        <div className="flex-1 flex flex-col">
          
          {/* Subtle Decorative Background Mesh (Minimalist, Bright) */}
          <div className="absolute inset-0 bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40 pointer-events-none -z-10"></div>
          
          {/* Navbar */}
          <header className={`w-full py-4 border-b border-slate-100 bg-white/70 backdrop-blur-md z-40 sticky top-0 transition-all duration-300`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
              
              {/* Brand ECI */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold tracking-tighter text-sm font-heading">
                  ECI
                </div>
                <div>
                  <h1 className="text-[12px] font-bold tracking-widest text-slate-950 uppercase font-heading leading-none">
                    EDUCATION COMMUNITY
                  </h1>
                  <span className="text-[9px] text-slate-400 font-mono tracking-wider">INDONESIA</span>
                </div>
              </div>

              {/* Actions & Status Indicator */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  id="toggle-rules-btn"
                  onClick={() => setCurrentView(prev => prev === 'rules' ? 'public' : 'rules')}
                  className={`px-2.5 sm:px-3 py-1.5 border text-[10.5px] sm:text-[11.5px] font-mono font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                    currentView === 'rules'
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-200/85 bg-white hover:border-sky-200 hover:bg-sky-50 text-slate-500 hover:text-sky-700'
                  }`}
                >
                  <span>Aturan</span>
                </button>

                <button
                  id="toggle-admin-btn"
                  onClick={() => setCurrentView(prev => prev === 'admin' ? 'public' : 'admin')}
                  className={`px-2.5 sm:px-3 py-1.5 border text-[10.5px] sm:text-[11.5px] font-mono font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                    currentView === 'admin'
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-200/85 bg-white hover:border-sky-200 hover:bg-sky-50 text-slate-500 hover:text-sky-700'
                  }`}
                >
                  <span>{currentView === 'admin' ? 'Formulir' : 'Kelola'}</span>
                </button>

                <div className="hidden md:flex items-center space-x-1.5 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100/40 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
                  <span className="text-[9.5px] font-mono text-sky-700 uppercase tracking-wider font-semibold">POR-SEL 2026</span>
                </div>
              </div>

            </div>
          </header>

          {/* Core Content Area */}
          <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-center items-center py-6">
            
            {/* View router condition */}
            <AnimatePresence mode="wait">
              {currentView === 'rules' ? (
                <motion.div
                  key="rules-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full"
                >
                  <RulesEci onBack={() => setCurrentView('public')} />
                </motion.div>
              ) : currentView === 'admin' ? (
                <motion.div
                  key="admin-panel-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full"
                >
                  <AdminPanel onBack={() => setCurrentView('public')} />
                </motion.div>
              ) : !record ? (
                // Form View state
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full flex flex-col items-center"
                >
                  
                  {/* Community Hero banner details on form step (Clean/Bright details) */}
                  <div className="text-center px-4 max-w-xl mx-auto mt-4 mb-4">
                    <p className="text-[11px] font-medium text-sky-600 tracking-widest uppercase font-mono">
                      #BelajarTanpaBatas
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading mt-2">
                      Portal Seleksi Anggota Baru ECI
                    </h2>
                    <p className="text-[11.5px] text-slate-500 mt-2.5 leading-relaxed font-smooth">
                      Komunitas edukasi kolaboratif nusantara. Kami mempertemukan ribuan pegiat pendidikan, pelajar, hingga pengajar di Indonesia untuk berdiskusi, bertukar ilmu, dan berkarta kreatif.
                    </p>
                  </div>

                  {/* Form Component */}
                  <FormRegistration onSubmit={handleRegistrationSubmit} />

                  {/* Trust Indicators / Stats */}
                  <div className="grid grid-cols-3 gap-6 max-w-lg w-full px-6 py-6 border-t border-slate-150/70 text-center mt-10">
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 font-heading">90+</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Member Aktif</span>
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 font-heading">8+</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Departemen Minat</span>
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 font-heading">100%</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">Gratis & Terbuka</span>
                    </div>
                  </div>

                </motion.div>
              ) : (
                // Success Credentials View state
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full"
                >
                  <SuccessView record={record} onReset={handleResetRecord} />
                </motion.div>
              )}
            </AnimatePresence>

          </main>

        </div>
      )}

      {/* Modern Compact Humanistic Footer */}
      {!loading && (
        <footer className="w-full py-5 border-t border-slate-100 bg-white text-center mt-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 tracking-wide font-smooth">
            <p>© 2026 Education Community Indonesia (ECI). All Rights Reserved.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center items-center">
              <span className="hover:text-slate-600 transition-colors uppercase font-mono text-[9px]">Hubungi Kami</span>
              <span className="text-slate-200">•</span>
              <span className="hover:text-slate-600 transition-colors uppercase font-mono text-[9px]">Kebijakan Privasi</span>
              <span className="text-slate-200">•</span>
              <button 
                onClick={() => setCurrentView('rules')}
                className="hover:text-sky-600 text-sky-500 font-bold transition-colors uppercase font-mono text-[9px] cursor-pointer"
              >
                Pedoman Komunitas (Rules ECI)
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Absolute Saving Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-xs text-center border border-slate-100 flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mb-4" />
            <h4 className="text-xs font-bold text-slate-900 font-heading uppercase tracking-wider">Mengirim Formulir...</h4>
            <p className="text-[10.5px] text-slate-400 mt-2 leading-relaxed">
              Pendaftaran Anda sedang didaftarkan ke cloud database Supabase. Mohon tunggu beberapa saat.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
