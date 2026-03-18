import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Mic, Video, X, UploadCloud, User } from 'lucide-react';
import { Button } from './Button';

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: string) => void;
  type: string;
  t: any;
}

export const MediaDrawer: React.FC<MediaDrawerProps> = ({ isOpen, onClose, onSave, type, t }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  if (!isOpen) return null;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      onSave(`${type}_capture_${Date.now()}.dat`);
      onClose();
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#F7F5F0] border-t border-[#E5E0D6] p-6 shadow-2xl animate-slide-up z-20 rounded-t-xl">
      <div className="flex justify-between items-center mb-6">
         <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
           {type === 'image' && <ImageIcon size={16} />}
           {type === 'audio' && <Mic size={16} />}
           {type === 'video' && <Video size={16} />}
           {t[type] || type}
         </h4>
         <button onClick={() => { setIsRecording(false); onClose(); }}><X size={18} /></button>
      </div>
      <div className="relative flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed border-[#E5E0D6] bg-white rounded-md mb-6 overflow-hidden">
         {!isRecording ? (
           <div className="text-center p-4">
             <UploadCloud size={32} className="mx-auto mb-2 text-gray-300" />
             <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.upload}</p>
           </div>
         ) : (
           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4 animate-fade-in">
              {type === 'audio' && (
                <div className="flex flex-col items-center">
                  <div className="flex gap-1 items-end mb-4 h-12">
                    {[1,2,3,4,5,6,7].map(i => (
                      <div key={i} className={`w-1 bg-[#C4A166] rounded-full animate-pulse`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <p className="text-xs font-mono text-red-500 font-bold mb-1">{formatTime(timer)}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.recording}</p>
                </div>
              )}
              {type === 'video' && (
                <div className="relative w-full aspect-video bg-black rounded flex items-center justify-center">
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-blink"></div>
                    <span className="text-[10px] font-mono text-white">REC {formatTime(timer)}</span>
                  </div>
                  <div className="absolute inset-0 border-[0.5px] border-white/20 pointer-events-none"></div>
                  <User size={48} className="text-white/10" />
                </div>
              )}
           </div>
         )}
      </div>
      <div className="flex gap-4">
        {!isRecording ? (
          <>
            <Button variant="secondary" className="w-full flex-1" onClick={() => { onSave(`${type}_file.dat`); onClose(); }}>{t.upload}</Button>
            {(type === 'audio' || type === 'video') && (<Button variant="primary" className="w-full flex-1" onClick={handleToggleRecord}>{t.record}</Button>)}
            {type === 'image' && (<Button variant="primary" className="w-full flex-1" onClick={() => { onSave(`camera_capture.jpg`); onClose(); }}>{t.takePhoto}</Button>)}
          </>
        ) : (
          <Button variant="danger" className="w-full" onClick={handleToggleRecord}>{t.stop}</Button>
        )}
      </div>
    </div>
  );
};
