import { useRef, useEffect, useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Circle, 
  Square, 
  Heart, 
  Sparkles,
  Sun,
  Flame,
  Droplet,
  Globe,
  Hand
} from 'lucide-react'
import { useStore, ShapeType } from '../store/useStore'
import { useHandTracking } from '../hooks/useHandTracking'

const SHAPES: { id: ShapeType; icon: React.ReactNode; label: string }[] = [
  { id: 'sphere', icon: <Circle size={20} />, label: 'Sphere' },
  { id: 'cube', icon: <Square size={20} />, label: 'Cube' },
  { id: 'heart', icon: <Heart size={20} />, label: 'Heart' },
  { id: 'spiral', icon: <Sparkles size={20} />, label: 'Spiral' },
  { id: 'galaxy', icon: <Sun size={20} />, label: 'Galaxy' },
  { id: 'firework', icon: <Flame size={20} />, label: 'Firework' },
  { id: 'bubble', icon: <Droplet size={20} />, label: 'Bubble' },
  { id: 'saturn', icon: <Globe size={20} />, label: 'Saturn' },
]

const COLOR_PRESETS = [
  '#00ffff',
  '#ff00ff',
  '#ffff00',
  '#00ff00',
  '#ff6600',
  '#ff0066',
  '#6600ff',
  '#ffffff',
]

export function ControlPanel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  const {
    isPanelOpen,
    togglePanel,
    currentShape,
    setCurrentShape,
    color,
    setColor,
    particleSize,
    setParticleSize,
    glowStrength,
    setGlowStrength,
    pinchProgress,
    isOpen,
    isHandDetected,
  } = useStore()

  useHandTracking(videoRef)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Camera access error:', error)
        setCameraError('Camera access denied')
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <>
      <button
        onClick={togglePanel}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 glass-panel p-2 rounded-r-lg text-cyan-400 hover:text-cyan-300 transition-colors"
        style={{ left: isPanelOpen ? '320px' : '0' }}
      >
        {isPanelOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <div
        className={`fixed left-0 top-0 h-full w-80 glass-panel z-40 transition-transform duration-300 overflow-y-auto ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          <h1 className="text-xl font-bold text-cyan-400 glow-text text-center">
            Gesture Particles
          </h1>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Hand size={16} />
              Camera Preview
            </h2>
            <div className="relative rounded-lg overflow-hidden border border-cyan-500/30">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 object-cover bg-black"
                style={{ transform: 'scaleX(-1)' }}
              />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-400 text-sm">
                  {cameraError}
                </div>
              )}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                isHandDetected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
            </div>
            <div className="text-xs text-cyan-400/70 text-center">
              {isHandDetected ? '✓ Hand Detected' : '○ No Hand Detected'}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">Gesture State</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-cyan-400/70 mb-1">
                  <span>Pinch</span>
                  <span>{Math.round(pinchProgress * 100)}%</span>
                </div>
                <div className="h-2 bg-cyan-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-100"
                    style={{ width: `${pinchProgress * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded ${isOpen ? 'bg-green-500/30 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>
                  Open Hand
                </span>
                <span className={`px-2 py-1 rounded ${pinchProgress > 0.5 ? 'bg-purple-500/30 text-purple-400' : 'bg-gray-700/50 text-gray-500'}`}>
                  Pinching
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">Shape</h2>
            <div className="grid grid-cols-4 gap-2">
              {SHAPES.map(({ id, icon, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentShape(id)}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    currentShape === id
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400'
                      : 'bg-cyan-900/20 text-cyan-500/70 border border-transparent hover:bg-cyan-800/30'
                  }`}
                  title={label}
                >
                  {icon}
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">Color</h2>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === presetColor ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ 
                    backgroundColor: presetColor,
                    boxShadow: color === presetColor ? `0 0 10px ${presetColor}` : 'none'
                  }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-2 border-cyan-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">Particle Size</h2>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={particleSize}
              onChange={(e) => setParticleSize(parseFloat(e.target.value))}
              className="w-full h-2 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer slider-cyber"
            />
            <div className="text-xs text-cyan-400/70 text-right">{particleSize.toFixed(1)}</div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">Glow Strength</h2>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={glowStrength}
              onChange={(e) => setGlowStrength(parseFloat(e.target.value))}
              className="w-full h-2 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer slider-cyber"
            />
            <div className="text-xs text-cyan-400/70 text-right">{glowStrength.toFixed(1)}</div>
          </div>

          <div className="text-xs text-cyan-500/50 text-center pt-4 border-t border-cyan-500/20">
            <p>👆 Pinch to contract particles</p>
            <p>✋ Open hand to explode</p>
            <p>🖐️ Move hand to repel</p>
          </div>
        </div>
      </div>
    </>
  )
}
