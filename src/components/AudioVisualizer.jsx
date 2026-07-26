import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2, Sparkles } from 'lucide-react';

export default function AudioVisualizer({ isRecording, onToggleRecording, durationSec }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawWaveform = (dataArray = null) => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      const numBars = 42;
      const barGap = 3;
      const totalBarWidth = (width - numBars * barGap) / numBars;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 6;
        if (isRecording) {
          if (dataArray && dataArray.length > 0) {
            const index = Math.floor((i / numBars) * dataArray.length);
            barHeight = Math.max(6, (dataArray[index] / 255) * height * 0.88);
          } else {
            const time = Date.now() * 0.005;
            barHeight = Math.max(8, Math.sin(time + i * 0.35) * (height * 0.42) + (height * 0.46));
          }
        }

        const x = i * (totalBarWidth + barGap);
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isRecording) {
          grad.addColorStop(0,   '#A78BFA'); // violet-400
          grad.addColorStop(0.5, '#7C3AED'); // violet-600
          grad.addColorStop(1,   '#06B6D4'); // cyan-500
        } else {
          grad.addColorStop(0, 'rgba(124,58,237,0.18)');
          grad.addColorStop(1, 'rgba(6,182,212,0.08)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, totalBarWidth, barHeight, 3);
        ctx.fill();
      }
    };

    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          setMicPermissionDenied(false);
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
          analyserRef.current = audioCtxRef.current.createAnalyser();
          analyserRef.current.fftSize = 128;
          const source = audioCtxRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          const render = () => {
            if (analyserRef.current) analyserRef.current.getByteFrequencyData(dataArray);
            drawWaveform(dataArray);
            animationFrameRef.current = requestAnimationFrame(render);
          };
          render();
        })
        .catch(err => {
          console.warn('Mic unavailable, using animated fallback.', err);
          setMicPermissionDenied(true);
          const renderFallback = () => {
            drawWaveform(null);
            animationFrameRef.current = requestAnimationFrame(renderFallback);
          };
          renderFallback();
        });
    } else {
      drawWaveform(null);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [isRecording]);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  };

  return (
    <div
      className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
      style={{ border: '1px solid rgba(124,58,237,0.25)' }}
    >
      {/* Background glows */}
      <div className="absolute -top-20 -left-20 w-52 h-52 rounded-full pointer-events-none"
           style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(50px)' }} />
      <div className="absolute -bottom-20 -right-20 w-52 h-52 rounded-full pointer-events-none"
           style={{ background: 'rgba(6,182,212,0.08)', filter: 'blur(50px)' }} />

      <div className="flex items-center gap-5 z-10">
        {/* Record button */}
        <button
          onClick={onToggleRecording}
          className={`relative flex items-center justify-center w-16 h-16 rounded-2xl font-semibold transition-all duration-300 active:scale-95 ${
            isRecording
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : ''
          }`}
          style={!isRecording ? {
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            boxShadow: '0 4px 24px rgba(124,58,237,0.5), 0 0 0 1px rgba(124,58,237,0.4) inset'
          } : {
            boxShadow: '0 4px 24px rgba(239,68,68,0.5)'
          }}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? (
            <Square className="w-6 h-6 fill-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}

          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-2xl border-2 border-rose-400 animate-ping opacity-70 pointer-events-none" />
              <span className="absolute inset-0 rounded-2xl border border-rose-300 animate-ping opacity-40 pointer-events-none" style={{ animationDelay: '0.3s' }} />
            </>
          )}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-zinc-600'}`} />
            <h3 className="text-base font-bold text-zinc-100">
              {isRecording ? 'Live Recording' : 'Audio Capture Ready'}
            </h3>
          </div>
          <p className="text-xs mt-1" style={{ color: isRecording ? '#FDA4AF' : 'var(--text-muted)' }}>
            {isRecording
              ? 'Recording in progress — speak clearly'
              : 'Click to record or paste a transcript below'}
          </p>
          {micPermissionDenied && (
            <p className="text-[10px] text-amber-400 mt-1">⚠ Mic blocked — using animated fallback</p>
          )}
        </div>
      </div>

      {/* Canvas + timer */}
      <div className="flex-1 w-full max-w-md flex flex-col items-center md:items-end gap-2 z-10">
        <div className="w-full h-16 rounded-xl p-2 flex items-center justify-center"
             style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <canvas ref={canvasRef} width={380} height={48} className="w-full h-full" />
        </div>
        <div className="flex items-center justify-between w-full text-xs px-1" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-violet-400" />
            {isRecording ? 'Web Audio API Live' : 'Mic Idle'}
          </span>
          <span className="font-mono font-bold text-sm" style={{ color: '#A78BFA' }}>
            {formatTimer(durationSec)}
          </span>
        </div>
      </div>
    </div>
  );
}
