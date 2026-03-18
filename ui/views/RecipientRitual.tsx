import React, { useState, useEffect, useRef } from 'react';
import { Infinity, Image as ImageIcon, UploadCloud, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { theme } from '../../logic/constants';
import { Button } from '../components/Button';
import { ArchIcon } from '../components/ArchIcon';

interface RecipientRitualProps {
  t: any;
  navigate: (view: string) => void;
}

export const RecipientRitual: React.FC<RecipientRitualProps> = ({ t, navigate }) => {
  const [phase, setPhase] = useState(0); 
  const [showReflection, setShowReflection] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<{title: string, text: string} | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!letterRef.current) return;
    
    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cofria-message.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Function to synthesize a breathing sound using Web Audio API
  // This avoids external dependencies and broken links
  const playBreathingSound = () => {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      
      const ctx = new Ctx();
      audioContextRef.current = ctx;

      // Total duration: 4s Inhale + 4s Exhale = 8s
      const duration = 8; 
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Create noise source
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Create filter to make it sound like "air" (Lowpass)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      
      // Create gain node for the envelope
      const gain = ctx.createGain();
      
      // Connect graph
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Envelope: 
      // 0s -> 4s: Fade In (Inhale)
      // 4s -> 8s: Fade Out (Exhale)
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      
      // Ascending pitch/frequency for inhale, descending for exhale
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 4);
      filter.frequency.exponentialRampToValueAtTime(200, now + 8);

      gain.gain.linearRampToValueAtTime(0.6, now + 4); // Peak volume at end of Inhale
      gain.gain.linearRampToValueAtTime(0, now + 8);     // Silence at end of Exhale

      noise.start(now);
      noise.stop(now + 8);

    } catch (e) {
      console.error("Web Audio API failed:", e);
    }
  };

  useEffect(() => { 
    if (phase === 1) { 
      const timer = setTimeout(() => setPhase(2), 4000); 
      return () => clearTimeout(timer); 
    }
    if (phase === 2) {
      const timer = setTimeout(() => setPhase(3), 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const startRitual = () => {
    playBreathingSound();
    setPhase(1);
  };
  
  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (phase === 5) {
      // Calculate reading time. 
      // Message length is about 40 words. 
      // 40 words / 200 wpm = 0.2 mins = 12 seconds.
      // Plus 3 seconds pause = 15 seconds.
      // For demo purposes, let's use 8 seconds so the user doesn't wait too long, 
      // but it feels like a deliberate pause.
      const timer = setTimeout(() => {
        setShowReflection(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === 0) { 
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme.bg} px-6`}>
        <div className="bg-white p-8 md:p-12 max-w-lg w-full text-center shadow-sm border border-[#E5E0D6] animate-fade-in">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#1A233A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Infinity className="text-[#C4A166]" />
          </div>
          <h2 className={`${theme.fontSerif} text-2xl md:text-3xl mb-8 leading-tight`}>{t.ritual.step1}</h2>
          <Button onClick={startRitual} className="w-full py-4">{t.ritual.start}</Button>
        </div>
      </div>
    ); 
  }

  if (phase === 1 || phase === 2) { 
    return (
      <div className="min-h-screen bg-[#1A233A] flex flex-col items-center justify-center text-[#F7F5F0] transition-colors duration-1000 relative">
        <div className="text-center animate-pulse p-6 flex-1 flex flex-col justify-center">
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#C4A166]/30 flex items-center justify-center mx-auto mb-8 transition-all duration-[4000ms] ease-in-out ${phase === 1 ? 'scale-125' : 'scale-90'}`}>
            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#C4A166]/10 transition-all duration-[4000ms] ease-in-out ${phase === 1 ? 'scale-150 opacity-100' : 'scale-75 opacity-50'}`}></div>
          </div>
          <p className={`${theme.fontSerif} text-2xl md:text-3xl tracking-wide opacity-80 animate-fade-in`}>
            {phase === 1 ? t.ritual.inhale : t.ritual.exhale}
          </p>
        </div>
        <div className="absolute bottom-12 px-6 text-center w-full">
          <p className="text-sm md:text-base text-[#C4A166] opacity-70 tracking-widest uppercase max-w-md mx-auto leading-relaxed">
            {t.ritual.breatheText}
          </p>
        </div>
      </div>
    ); 
  }

  if (phase === 3) {
    return (
      <div className="min-h-screen bg-[#1A233A] flex flex-col items-center justify-center text-[#F7F5F0] relative overflow-hidden">
        {/* Línea de luz */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-[#C4A166] shadow-[0_0_15px_#C4A166] animate-pulse"></div>
        </div>
        
        <div className="z-10 text-center animate-fade-in-up">
          <p className={`${theme.fontSerif} text-xl md:text-2xl tracking-wide opacity-90 mb-8`}>
            {t.ritual.step3}
          </p>
          <Button onClick={() => setPhase(4)} className="px-8 py-3 bg-transparent border border-[#C4A166] text-[#C4A166] hover:bg-[#C4A166] hover:text-[#1A233A] transition-colors">
            {t.ritual.openBtn}
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 4) {
    return (
      <div className="min-h-screen bg-[#1A233A] flex items-center justify-center px-6 animate-fade-in relative">
        {/* Subtle background texture/glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,161,102,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        
        <div 
          onClick={() => setPhase(5)}
          className="bg-[#F7F5F0] w-full max-w-lg rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 md:p-16 relative cursor-pointer transform transition-transform hover:scale-[1.02] duration-500"
        >
          {/* Wax Seal */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16">
            <div className="absolute inset-0 bg-[#722F37] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border border-[#5a252c]">
              <div className="w-12 h-12 rounded-full border border-[#8b3a43] flex items-center justify-center">
                <Infinity size={20} className="text-[#d4af37] opacity-80" />
              </div>
            </div>
          </div>

          <div className="text-center mt-8 space-y-6">
            <p className={`${theme.fontSerif} italic text-2xl md:text-3xl text-[#1A233A]`}>
              {t.ritual.sender} Sarah
            </p>
            <div className="w-12 h-[1px] bg-[#C4A166]/30 mx-auto"></div>
            <p className={`${theme.fontSerif} italic text-lg md:text-xl text-[#5D6B82] leading-relaxed`}>
              {t.ritual.envelopeText.replace('{date}', '14/06/2024')}
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <div className="ribbon-embroidered animate-pulse">
              {t.ritual.openBtn}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 md:py-20 px-6 animate-fade-in-slow overflow-y-auto relative">
      {/* Curtain effect overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 flex">
        <div className="w-1/2 h-full bg-[#1A233A] animate-slide-out-left"></div>
        <div className="w-1/2 h-full bg-[#1A233A] animate-slide-out-right"></div>
      </div>

      <div className="max-w-2xl w-full pb-20 mt-12 opacity-0 animate-fade-in-delayed relative">
        <div ref={letterRef} className="relative bg-white sm:p-8 -mx-8 px-8 sm:mx-0 rounded-lg">
          {/* Postal Stamp */}
          <div className="absolute right-8 top-36 opacity-40 rotate-12 pointer-events-none hidden sm:block">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#C62828] flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full border-2 border-[#C62828] flex flex-col items-center justify-center text-[#C62828]">
                <span className="text-[8px] tracking-widest uppercase font-bold">Postage</span>
                <ArchIcon className="w-6 h-6 my-1" />
                <span className="text-[8px] tracking-widest font-bold">2024</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <ArchIcon className="w-7 h-7 text-[#1A233A]" />
              <span className={`${theme.fontSerif} tracking-widest text-[#1A233A] font-bold text-lg`}>COFRIA</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.ritual.sender} Sarah</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.ritual.savedOn} 14/06/2024</p>
            </div>
          </div>
          <h1 className={`${theme.fontSerif} text-3xl md:text-4xl mb-8 text-[#1A233A]`}>Para tus 30s</h1>
          <div className="prose prose-lg text-gray-700 leading-relaxed font-serif space-y-4">
            <p>Sarah,</p>
            <p>Si estás leyendo esto, lo lograste. Los turbulentos 20 terminaron. Quería escribirte esto hoy, mientras las cosas están calmadas, para recordarte quién querías ser.</p>
            <p>No olvides visitar el océano. No olvides que la ambición no es nada sin paz.</p>
            <p>Con amor,<br/>Tú, desde 2024.</p>
          </div>
        </div>

        {/* Attachment Download */}
        <div className="mt-12 mb-8 p-4 border border-gray-100 rounded bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center rounded">
                <ImageIcon size={16} className="text-[#C4A166]" />
            </div>
            <div>
                <p className="text-sm text-[#1A233A] font-medium">memory_01.jpg</p>
                <p className="text-[10px] text-gray-500 uppercase">2.4 MB</p>
            </div>
            </div>
            <button className="text-xs uppercase tracking-widest text-[#C4A166] hover:text-[#1A233A] transition-colors flex items-center gap-2 font-bold">
            <UploadCloud size={14} /> {t.ritual.download}
            </button>
        </div>

        {/* Reflection Section */}
        {showReflection && (
          <div className="mt-24 pt-12 border-t border-gray-200 animate-fade-in-up text-center">
            <h3 className={`${theme.fontSerif} text-2xl text-[#1A233A] mb-4`}>{t.ritual.reflectionTitle}</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">{t.ritual.reflectionSubtitle}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button onClick={() => navigate('create')} className="px-8 py-4">
                {t.ritual.createBtn}
              </Button>
              {/* Only show if message was scheduled and sender is alive (simulated here) */}
              {true && (
                <Button variant="secondary" onClick={() => navigate('create')} className="px-8 py-4">
                  {t.ritual.responseBtn}
                </Button>
              )}
            </div>

            <div className="text-left max-w-lg mx-auto bg-gray-50 p-6 rounded-lg border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 text-center">{t.ritual.suggestionsTitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => setSelectedSuggestion({ title: t.ritual.child, text: t.ritual.suggestionChildText })} className="text-sm text-[#1A233A] bg-white border border-gray-200 py-3 px-4 rounded hover:border-[#C4A166] transition-colors text-left flex items-center justify-between group">
                  {t.ritual.child} <span className="text-[#C4A166] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button onClick={() => setSelectedSuggestion({ title: t.ritual.partner, text: t.ritual.suggestionPartnerText })} className="text-sm text-[#1A233A] bg-white border border-gray-200 py-3 px-4 rounded hover:border-[#C4A166] transition-colors text-left flex items-center justify-between group">
                  {t.ritual.partner} <span className="text-[#C4A166] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button onClick={() => setSelectedSuggestion({ title: t.ritual.futureSelf, text: t.ritual.suggestionFutureSelfText })} className="text-sm text-[#1A233A] bg-white border border-gray-200 py-3 px-4 rounded hover:border-[#C4A166] transition-colors text-left flex items-center justify-between group">
                  {t.ritual.futureSelf} <span className="text-[#C4A166] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button onClick={() => setSelectedSuggestion({ title: t.ritual.parents, text: t.ritual.suggestionParentsText })} className="text-sm text-[#1A233A] bg-white border border-gray-200 py-3 px-4 rounded hover:border-[#C4A166] transition-colors text-left flex items-center justify-between group">
                  {t.ritual.parents} <span className="text-[#C4A166] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-xs text-red-400 mb-4 uppercase tracking-widest">{t.ritual.warning}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="secondary" onClick={() => navigate('create')}>{t.ritual.close}</Button>
                <button 
                  onClick={downloadPDF}
                  className="px-6 py-3 border border-[#C4A166] text-[#C4A166] rounded hover:bg-[#C4A166] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
                >
                  <Download size={16} /> {t.ritual.downloadMessageBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg max-w-md w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => setSelectedSuggestion(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1A233A] transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <ArchIcon className="w-8 h-8 text-[#C4A166] mx-auto mb-4" />
              <h3 className={`${theme.fontSerif} text-2xl text-[#1A233A] mb-2`}>{selectedSuggestion.title}</h3>
              <p className="text-xs uppercase tracking-widest text-gray-400">Sugerencia</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded border border-gray-100 mb-8">
              <p className="text-gray-600 italic text-center leading-relaxed">
                "{selectedSuggestion.text}"
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setSelectedSuggestion(null);
                navigate('create');
              }} 
              className="w-full py-4"
            >
              {t.ritual.startWritingBtn}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
