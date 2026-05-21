/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Sparkles, MessageCircle, AlertCircle, ArrowUpRight, 
  RefreshCw, FileText, CreditCard, ChevronRight, Share2 
} from 'lucide-react';
import { RegistrationRecord } from '../types';
import SuratFormulir from './SuratFormulir';
import MemberCard from './MemberCard';

interface SuccessViewProps {
  record: RegistrationRecord;
  onReset: () => void;
  hideResetBtn?: boolean;
}

export default function SuccessView({ record, onReset, hideResetBtn = false }: SuccessViewProps) {
  const [activeTab, setActiveTab] = useState<'both' | 'letter' | 'card'>('both');
  
  const whatsappUrl = "https://chat.whatsapp.com/HHcjDimJuVABphM5cFg6XU?s=cl&p=a&mlu=1";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      
      {/* Celebration Header */}
      <div className="text-center mb-10 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_0_8px_rgba(16,185,129,0.1)]"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Registrasi Berhasil Terkirim!
        </h2>
        <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">
          Selamat <strong className="text-slate-800 uppercase">{record.fullName}</strong>, data Anda telah resmi terverifikasi secara elektronik oleh sistem ECI. Silakan unduh dokumen administrasi di bawah ini.
        </p>
      </div>

      {/* STEP-BY-STEP INSTRUCTIONS GUIDE */}
      {!hideResetBtn && (
        <div className="glass-panel rounded-2xl p-5 mb-10 shadow-soft border border-slate-100 max-w-3xl mx-auto">
          <h4 className="text-[11.5px] font-bold tracking-wider text-slate-900 uppercase mb-3.5 flex items-center space-x-2 font-heading">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Panduan Langkah Selanjutnya (PENTING!)</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-smooth">
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase">LANGKAH 01</span>
                <h5 className="font-semibold text-slate-800 mt-2 mb-1">Unduh Dokumen Formulir</h5>
                <p className="text-slate-500 leading-relaxed text-[10px]">Unduh bukti Surat Formulir Pendaftaran resmi Anda sebagai bukti pendukung utama.</p>
              </div>
              <div className="text-slate-400 font-mono text-[9px] mt-2 italic">Format: Image PNG</div>
            </div>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase">LANGKAH 02</span>
                <h5 className="font-semibold text-slate-800 mt-2 mb-1">Unduh Member Card</h5>
                <p className="text-slate-500 leading-relaxed text-[10px]">Unduh ECI Digital Member Card resmi yang menampilkan Identitas & Bidang Pembelajaran Anda.</p>
              </div>
              <div className="text-slate-400 font-mono text-[9px] mt-2 italic">Format: Image PNG</div>
            </div>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider font-bold text-sky-600 bg-teal-50 text-teal-700 px-2 py-0.5 rounded uppercase">LANGKAH 03</span>
                <h5 className="font-semibold text-slate-800 mt-2 mb-1">Masuk ke Grup Seleksi WA</h5>
                <p className="text-slate-500 leading-relaxed text-[10px]">Gabung grup seleksi resmi, kemudian kirimkan kedua gambar yang sudah diunduh ke sana.</p>
              </div>
              <div className="text-emerald-600 font-sans text-[9.5px] mt-2 font-medium flex items-center space-x-0.5">
                <span>Wajib bergabung</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* WhatsApp Selection Group Button (HIGHLIGHTED) */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3.5">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-md">
                Kirimkan <strong className="text-slate-700">Surat Bukti Formulir</strong> & <strong className="text-slate-700">Member Card</strong> Anda di WhatsApp untuk verifikasi manual oleh komite penyeleksi ECI.
              </p>
            </div>
            
            <a
              id="whatsapp-group-link"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11.5px] font-semibold tracking-wide transition-all duration-200 flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:scale-[1.01]"
            >
              <MessageCircle className="w-4.5 h-4.5 fill-current" />
              <span>Gabung Grup Seleksi WA</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW SECTIONS WITH TAB FILTERS */}
      <div className="mb-10">
        
        {/* Tab view controller for smaller devices */}
        <div className="flex justify-center border-b border-slate-200 mb-8 max-w-md mx-auto">
          <button
            id="tab-view-both"
            onClick={() => setActiveTab('both')}
            className={`flex-1 py-2 text-[11px] font-medium transition-all duration-200 border-b-2 text-center select-none cursor-pointer ${
              activeTab === 'both' 
                ? 'border-sky-500 text-sky-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Tampilkan Keduanya
          </button>
          <button
            id="tab-view-letter"
            onClick={() => setActiveTab('letter')}
            className={`flex-1 py-2 text-[11px] font-medium transition-all duration-200 border-b-2 text-center select-none cursor-pointer ${
              activeTab === 'letter' 
                ? 'border-sky-500 text-sky-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Surat Formulir
          </button>
          <button
            id="tab-view-card"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2 text-[11px] font-medium transition-all duration-200 border-b-2 text-center select-none cursor-pointer ${
              activeTab === 'card' 
                ? 'border-sky-500 text-sky-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Digital Member Card
          </button>
        </div>

        {/* Content displays based on selection and screen sizing */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start justify-center">
          
          {/* 1. Formal Surat Formulir sheet */}
          {(activeTab === 'both' || activeTab === 'letter') && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center flex-1 order-2 lg:order-1"
            >
              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3 align-self-start font-heading">
                <FileText className="w-4 h-4 text-sky-500" />
                <span>SURAT BUKTI FORMULIR SELEKSI</span>
              </div>
              <SuratFormulir record={record} />
            </motion.div>
          )}

          {/* 2. Compact Digital ID Member Card */}
          {(activeTab === 'both' || activeTab === 'card') && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center shrink-0 order-1 lg:order-2"
            >
              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3 align-self-start font-heading">
                <CreditCard className="w-4 h-4 text-sky-500" />
                <span>ECI DIGITAL ID PASS</span>
              </div>
              <MemberCard record={record} />
            </motion.div>
          )}

        </div>
      </div>

      {/* COMPACT FLOATING / FOOTER OPTIONS */}
      {!hideResetBtn && (
        <div className="flex flex-col items-center justify-center space-y-4 pt-10 border-t border-slate-150 max-w-md mx-auto">
          <p className="text-[10px] text-slate-400 leading-normal text-center max-w-xs font-smooth">
            Ingin memperbaiki data isian yang salah? Silakan klik tombol di bawah untuk mengulangi formulir pendaftaran.
          </p>
          <button
            id="re-register-btn"
            onClick={onReset}
            className="px-4.5 py-2 hover:bg-slate-100 hover:text-slate-900 text-slate-600 rounded-lg text-[10.5px] font-medium border border-slate-200 transition-all duration-200 flex items-center space-x-1.5 cursor-pointer font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ulangi Registrasi / Daftar Baru</span>
          </button>
        </div>
      )}

    </div>
  );
}
