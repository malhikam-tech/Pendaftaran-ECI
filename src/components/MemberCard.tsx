/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Sparkles, ShieldCheck, GraduationCap } from 'lucide-react';
import { RegistrationRecord } from '../types';

interface MemberCardProps {
  record: RegistrationRecord;
}

export default function MemberCard({ record }: MemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [scale, setScale] = useState(1);

  // Calculate dynamic scale factor based on parent width
  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth < 345) {
          setScale(containerWidth / 345);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(handleResize, 150);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Download Member Card layout as high-res PNG image
  const [fallbackCardImage, setFallbackCardImage] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      
      // Save current scale style properties for restoration
      const originalTransform = cardRef.current.style.transform;
      const originalTransformOrigin = cardRef.current.style.transformOrigin;
      const originalWidth = cardRef.current.style.width;
      const originalHeight = cardRef.current.style.height;

      // Temporarily remove scale transformations to snapshot full quality element
      cardRef.current.style.transform = 'none';
      cardRef.current.style.transformOrigin = '';
      cardRef.current.style.width = '340px';
      cardRef.current.style.height = '540px';

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Very high definition render for crispy text
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Transparent card corners
        logging: false,
      });

      // Restore scale transformations immediately
      cardRef.current.style.transform = originalTransform;
      cardRef.current.style.transformOrigin = originalTransformOrigin;
      cardRef.current.style.width = originalWidth;
      cardRef.current.style.height = originalHeight;

      // Clean Blob delivery structure
      canvas.toBlob((blob) => {
        if (!blob) {
          const imgData = canvas.toDataURL('image/png');
          setFallbackCardImage(imgData);
          setDownloadSuccess(true);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `Member_Card_ECI_${record.fullName.replace(/\s+/g, '_')}.png`;
        link.href = url;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Populate fallback image preview stream
        const reader = new FileReader();
        reader.onloadend = () => {
          setFallbackCardImage(reader.result as string);
        };
        reader.readAsDataURL(blob);

        setDownloadSuccess(true);
        setTimeout(() => {
          URL.revokeObjectURL(url);
          setDownloadSuccess(false);
        }, 3000);
      }, 'image/png');

    } catch (err) {
      console.error('Error generating card download:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Aspect Ratio limited container */}
      <div 
        ref={containerRef}
        className="w-full max-w-sm flex justify-center py-2 overflow-hidden"
        style={{ height: `${555 * scale}px` }}
      >
        
        {/* Sleek Vertical ECI Member Card */}
        <div
          ref={cardRef}
          id="member-id-card"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out-back'
          }}
          className="relative w-[340px] h-[540px] rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between overflow-hidden shadow-xl shadow-slate-100/50 select-none shrink-0"
        >
          {/* Decorative Top Glowing Arcs */}
          <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-sky-50 to-sky-100/30 -z-10 rounded-b-[40px]"></div>
          
          {/* Subtle Abstract Lines pattern embedded */}
          <div className="absolute inset-0 opacity-[0.012] pointer-events-none -z-10">
            <svg width="100%" height="100%">
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 z-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                ECI
              </div>
              <div>
                <h4 className="text-[10px] font-bold tracking-widest text-slate-900 uppercase font-heading leading-tight">
                  EDUCATION COMMUNITY
                </h4>
                <p className="text-[7.5px] text-slate-400 font-mono tracking-wider">INDONESIA</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-[7px] tracking-widest text-sky-600 uppercase font-mono font-bold bg-sky-100/60 px-1.5 py-0.5 rounded">
                MEMBER PASS
              </span>
            </div>
          </div>

          {/* Card Body - Photo & User details */}
          <div className="flex flex-col items-center my-auto py-4 z-10">
            
            {/* Elegant Image Holder with glowing trim */}
            <div className="relative mb-5">
              {/* Outer soft double border */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-sky-450 to-sky-600/30 rounded-full blur-[2px] opacity-60"></div>
              <div className="relative w-28 h-28 rounded-full bg-slate-50 border-2 border-white p-1 overflow-hidden shadow-md">
                {record.profilePicture ? (
                  <img 
                    src={record.profilePicture} 
                    alt="Profile Card" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <GraduationCap className="w-12 h-12" />
                  </div>
                )}
              </div>
              
              {/* Overlay active verified tick */}
              <div className="absolute bottom-0 right-1 bg-sky-600 text-white p-1 rounded-full border-2 border-white shadow-soft">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Applicant Name (Adaptive font sizing based on string length) */}
            <div className="text-center px-4">
              <h3 className={`font-bold tracking-tight text-slate-900 font-heading leading-tight uppercase ${
                record.fullName.length > 20 ? 'text-sm' : 'text-base'
              }`}>
                {record.fullName}
              </h3>
              
              {/* Interest Chosen Badge */}
              <span className="inline-block mt-2 text-[8.5px] font-mono tracking-wider font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100/50">
                {record.interest}
              </span>
            </div>
          </div>

          {/* Card Footer - Dynamic details & Codes */}
          <div className="border-t border-slate-100 pt-4 mt-auto">
            <div className="grid grid-cols-2 gap-y-2.5 text-left mb-3">
              <div>
                <span className="text-[7.5px] text-slate-400 font-mono tracking-widest uppercase block mb-0.5">MEMBER ID</span>
                <span className="text-[10.5px] font-mono font-semibold text-slate-800">{record.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[7.5px] text-slate-400 font-mono tracking-widest uppercase block mb-0.5">TIPE ANGGOTA</span>
                <span className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wide">AKADEMIK</span>
              </div>
              <div>
                <span className="text-[7.5px] text-slate-400 font-mono tracking-widest uppercase block mb-0.5">TANGGAL GABUNG</span>
                <span className="text-[10px] font-semibold text-slate-800">{record.registrationDate}</span>
              </div>
              <div className="text-right">
                <span className="text-[7.5px] text-slate-400 font-mono tracking-widest uppercase block mb-0.5">STATUS FORMULIR</span>
                <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-wider">SECURE APPROVED</span>
              </div>
            </div>

            {/* Simulated verification layout */}
            <div className="flex items-center justify-between border-t border-slate-100/70 pt-3 mt-1 text-[7px] text-slate-400 font-mono">
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                <span>PENDIDIKAN KOMUNITAS INDONESIA</span>
              </div>
              <span>VERIFIED MEMBER BY ECI</span>
            </div>
          </div>

        </div>
      </div>

      {/* Download Action Trigger */}
      <div className="flex flex-col items-center mt-4">
        <button
          id="download-card-btn"
          onClick={handleDownload}
          disabled={downloading}
          className={`px-5 py-2.5 rounded-lg text-[11.5px] font-medium transition-all duration-300 flex items-center space-x-2 shadow-soft border ${
            downloadSuccess 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
          }`}
        >
          <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Mengekspor Kartu...' : 'Download Member Card (PNG)'}</span>
        </button>

        {fallbackCardImage && (
          <p className="text-[10px] text-slate-400 mt-2 text-center max-w-xs">
            Jika unduhan otomatis diblokir, silakan klik tombol di bawah untuk melihat gambar dan menyimpannya secara manual.
          </p>
        )}
      </div>

      {/* Fallback Image Backdrop Modal (Absolutely foolproof for any sandbox browser) */}
      {fallbackCardImage && (
        <div id="modal-card-fallback" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-heading tracking-wide uppercase">KARTU SIAP DISIMPAN</h3>
                <p className="text-[10px] text-slate-400 font-smooth mt-0.5">Ketuk lama pada gambar (di HP) atau klik kanan kemudian pilih "Simpan Gambar" (di komputer).</p>
              </div>
              <button 
                id="close-fallback-card-modal-btn"
                onClick={() => setFallbackCardImage(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors font-semibold"
              >
                Tutup
              </button>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50 flex justify-center max-h-[50vh] overflow-y-auto p-4">
              <div className="max-w-[220px]">
                <img 
                  src={fallbackCardImage} 
                  alt="Member Card" 
                  className="w-full h-auto object-contain select-text"
                />
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 text-center">
              <button
                id="close-fallback-card-modal-bottom-btn"
                onClick={() => setFallbackCardImage(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-all duration-200"
              >
                Selesai / Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
