/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Mempersiapkan formulir...');

  useEffect(() => {
    // Elegant progressing
    const textSequence = [
      { threshold: 0, text: 'Mempersiapkan Portal Registrasi...' },
      { threshold: 25, text: 'Meload Komponen Komunitas...' },
      { threshold: 50, text: 'Menyiapkan Data Minat & Bakat...' },
      { threshold: 75, text: 'Mengoptimalkan Tampilan Desain...' },
      { threshold: 92, text: 'Selamat Datang di ECI...' }
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350); // micro delay for feeling smooth
          return 100;
        }

        // Update text based on current progress
        const currentText = textSequence.reduce((text, step) => {
          if (next >= step.threshold) return step.text;
          return text;
        }, textSequence[0].text);
        setLoadingText(currentText);

        return next;
      });
    }, 28); // 100 * ~28ms is approx 2.8s + 200ms delay = 3 seconds total

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-between p-8 z-50 select-none">
      {/* Top spacer / indicator */}
      <div className="w-full flex justify-between items-center max-w-md mt-4">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase">ECI PORTAL v2.6</span>
        </div>
        <div className="text-[10px] tracking-wider text-slate-400 font-mono">{progress}%</div>
      </div>

      {/* Main content centered */}
      <div className="flex flex-col items-center max-w-md w-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-8"
        >
          {/* Subtle back decorative glow */}
          <div className="absolute -inset-4 bg-sky-200/20 rounded-full blur-xl animate-pulse"></div>
          
          <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-soft">
            <GraduationCap className="w-8 h-8 text-sky-600" />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute -top-1 -right-1 bg-sky-100 text-sky-700 p-1 rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 font-heading">
            Education Community Indonesia
          </h1>
          <p className="text-[11px] tracking-widest text-sky-600 uppercase font-medium mt-1">
            Membangun Masa Depan Edukasi Bangsa
          </p>
        </motion.div>

        {/* Minimal Progress Indicator */}
        <div className="w-full max-w-xs mt-10">
          <div className="h-[2px] w-full bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-sky-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-slate-400 mt-3 font-mono h-4 italic"
          >
            {loadingText}
          </motion.p>
        </div>
      </div>

      {/* Footer credits */}
      <div className="text-center mb-4">
        <p className="text-[10px] text-slate-400 font-sans tracking-wide">
          © 2026 ECI Core Team. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </div>
  );
}
