'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Play, Pause } from 'lucide-react'

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle'

const PHASE_CONFIG: Record<Exclude<Phase, 'idle'>, { duration: number; label: string; color: string }> = {
  inhale: { duration: 4, label: 'Tarik napas...', color: 'bg-coral/20 border-coral' },
  hold: { duration: 7, label: 'Tahan...', color: 'bg-sand/20 border-sand' },
  exhale: { duration: 8, label: 'Hembuskan...', color: 'bg-sage/20 border-sage' },
}

interface BreathingGuideProps {
  onClose: () => void
}

export function BreathingGuide({ onClose }: BreathingGuideProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseRef = useRef<Phase>('idle')

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setPhase('idle')
    setCount(0)
    phaseRef.current = 'idle'
  }, [clearTimer])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  function start() {
    setIsRunning(true)
    setCycles(0)
    setPhase('inhale')
    setCount(1)
    phaseRef.current = 'inhale'

    const phases: Phase[] = ['inhale', 'hold', 'exhale']
    let currentPhaseIdx = 0
    let currentCount = 1

    timerRef.current = setInterval(() => {
      const p = phases[currentPhaseIdx] as Exclude<Phase, 'idle'>
      const cfg = PHASE_CONFIG[p]

      if (currentCount < cfg.duration) {
        currentCount++
        setCount(currentCount)
      } else {
        currentPhaseIdx++
        if (currentPhaseIdx >= phases.length) {
          currentPhaseIdx = 0
          setCycles((c) => c + 1)
        }
        const next = phases[currentPhaseIdx]
        phaseRef.current = next
        setPhase(next)
        currentCount = 1
        setCount(1)
      }
    }, 1000)
  }

  const isActive = phase !== 'idle' && isRunning
  const currentPhase = phase === 'idle' ? null : PHASE_CONFIG[phase as Exclude<Phase, 'idle'>]
  const scale = phase === 'inhale' ? 1 + (count / 4) * 0.3
    : phase === 'hold' ? 1.3
    : phase === 'exhale' ? 1.3 - (count / 8) * 0.3
    : 1

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Tutup"
      >
        <X className="w-5 h-5 text-muted-foreground" />
      </button>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Panduan Napas</h2>
        <p className="text-xs text-muted-foreground mt-1">
          4-7-8 — tarik, tahan, hembus
        </p>
      </div>

      <div className="relative mt-12 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="w-48 h-48 rounded-full border-2 transition-all duration-700 ease-in-out"
          style={{
            borderColor: currentPhase ? currentPhase.color.replace('border-', '') : 'var(--border)',
            transform: `scale(${isActive ? scale : 1})`,
            opacity: isActive ? 1 : 0.4,
          }}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <span className="text-5xl select-none">
              {phase === 'inhale' ? '🌬️' : phase === 'hold' ? '⏸️' : phase === 'exhale' ? '🌫️' : '🫁'}
            </span>
          </div>
        </div>

        {/* Progress arc */}
        {isActive && currentPhase && (
          <svg className="absolute inset-0 w-48 h-48 -rotate-90" viewBox="0 0 192 192">
            <circle
              cx="96" cy="96" r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(count / currentPhase.duration) * 565} 565`}
              className="text-coral transition-all duration-700"
              opacity="0.6"
            />
          </svg>
        )}
      </div>

      {isActive && currentPhase && (
        <p className="mt-6 text-sm font-medium" style={{ color: currentPhase.color.match(/text-(\w+)/)?.[1] ? undefined : 'var(--foreground)' }}>
          {currentPhase.label}
        </p>
      )}

      <p className="mt-1 text-xs text-muted-foreground">
        {isActive ? `${count} / ${currentPhase!.duration}` : 'Siap?'}
      </p>

      {cycles > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Siklus: {cycles}
        </p>
      )}

      <div className="mt-8 flex gap-3">
        {!isRunning ? (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-md bg-coral text-white px-6 py-2.5 text-sm font-medium hover:bg-coral/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            Mulai
          </button>
        ) : (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background text-foreground px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Pause className="w-4 h-4" />
            Berhenti
          </button>
        )}
      </div>

      <p className="mt-8 text-xs text-muted-foreground/60 max-w-xs text-center leading-relaxed px-4">
        Tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik. Ulangi.
        Kalau pusing, berhenti dulu ya.
      </p>
    </div>
  )
}
