import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';

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
      const barGap = 4;
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
          grad.addColorStop(0,   '#F43F5E'); // Rose
          grad.addColorStop(0.5, '#6366F1'); // Indigo
          grad.addColorStop(1,   '#10B981'); // Emerald
        } else {
          grad.addColorStop(0, '#64748B');
          grad.addColorStop(1, '#334155');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, totalBarWidth, barHeight, 2);
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
    <div className="brutal-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        {/* Record button */}
        <button
          onClick={onToggleRecording}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border-3 border-slate-900 font-bold transition-all active:translate-x-1 active:translate-y-1 ${
            isRecording
              ? 'bg-rose-500 text-white shadow-[4px_4px_0px_#000]'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-[4px_4px_0px_#000]'
          }`}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? (
            <Square className="w-6 h-6 fill-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full border-2 border-slate-900 ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-zinc-500'}`} />
            <h3 className="text-lg font-bold font-heading">
              {isRecording ? 'Live Speech Stream' : 'Audio Capture Ready'}
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {isRecording
              ? 'Recording in progress — speak clearly'
              : 'Click button to start recording or paste transcript below'}
          </p>
          {micPermissionDenied && (
            <p className="text-xs text-amber-400 mt-1 font-mono">⚠ Mic blocked — using animated fallback</p>
          )}
        </div>
      </div>

      {/* Canvas + timer */}
      <div className="flex-1 w-full max-w-md flex flex-col items-center md:items-end gap-2">
        <div className="w-full h-16 neu-inset p-2 flex items-center justify-center">
          <canvas ref={canvasRef} width={380} height={48} className="w-full h-full" />
        </div>
        <div className="flex items-center justify-between w-full text-xs font-mono px-1">
          <span className="flex items-center gap-1.5 font-bold">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            {isRecording ? 'WEB AUDIO LIVE' : 'MIC IDLE'}
          </span>
          <span className="brutal-badge bg-amber-400 text-slate-900 font-extrabold text-sm">
            {formatTimer(durationSec)}
          </span>
        </div>
      </div>
    </div>
  );
}
