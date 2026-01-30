import { create } from 'zustand'

export type ShapeType = 'sphere' | 'cube' | 'heart' | 'spiral' | 'galaxy' | 'firework' | 'bubble' | 'saturn'

interface GestureState {
  pinchProgress: number
  isOpen: boolean
  handPosition: { x: number; y: number; z: number } | null
  isHandDetected: boolean
}

interface ParticleSettings {
  color: string
  particleSize: number
  glowStrength: number
  currentShape: ShapeType
}

interface UIState {
  isPanelOpen: boolean
}

interface Store extends GestureState, ParticleSettings, UIState {
  setPinchProgress: (progress: number) => void
  setIsOpen: (isOpen: boolean) => void
  setHandPosition: (position: { x: number; y: number; z: number } | null) => void
  setIsHandDetected: (detected: boolean) => void
  setColor: (color: string) => void
  setParticleSize: (size: number) => void
  setGlowStrength: (strength: number) => void
  setCurrentShape: (shape: ShapeType) => void
  togglePanel: () => void
}

export const useStore = create<Store>((set) => ({
  pinchProgress: 0,
  isOpen: false,
  handPosition: null,
  isHandDetected: false,
  
  color: '#00ffff',
  particleSize: 1.0,
  glowStrength: 1.0,
  currentShape: 'sphere',
  
  isPanelOpen: true,
  
  setPinchProgress: (progress) => set({ pinchProgress: progress }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setHandPosition: (position) => set({ handPosition: position }),
  setIsHandDetected: (detected) => set({ isHandDetected: detected }),
  setColor: (color) => set({ color }),
  setParticleSize: (size) => set({ particleSize: size }),
  setGlowStrength: (strength) => set({ glowStrength: strength }),
  setCurrentShape: (shape) => set({ currentShape: shape }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
}))
