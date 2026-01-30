import { useEffect, useRef, useCallback } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { useStore } from '../store/useStore'

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement>) {
  const handLandmarkerRef = useRef<HandLandmarker | null>(null)
  const animationFrameRef = useRef<number>(0)
  
  const { setPinchProgress, setIsOpen, setHandPosition, setIsHandDetected } = useStore()

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  const detectGestures = useCallback((landmarks: { x: number; y: number; z: number }[]) => {
    const thumbTip = landmarks[4]
    const indexTip = landmarks[8]
    const middleTip = landmarks[12]
    const ringTip = landmarks[16]
    const pinkyTip = landmarks[20]
    const wrist = landmarks[0]

    const pinchDistance = calculateDistance(thumbTip, indexTip)
    const pinchThreshold = 0.08
    const openThreshold = 0.25

    const pinchProgress = Math.max(0, Math.min(1, 1 - (pinchDistance / openThreshold)))
    setPinchProgress(pinchProgress)

    const isPinching = pinchDistance < pinchThreshold
    const fingerSpread = (
      calculateDistance(thumbTip, indexTip) +
      calculateDistance(indexTip, middleTip) +
      calculateDistance(middleTip, ringTip) +
      calculateDistance(ringTip, pinkyTip)
    ) / 4

    const isOpenHand = fingerSpread > 0.12 && !isPinching
    setIsOpen(isOpenHand)

    const palmCenter = {
      x: (wrist.x + landmarks[9].x) / 2,
      y: (wrist.y + landmarks[9].y) / 2,
      z: (wrist.z + landmarks[9].z) / 2
    }

    const mappedPosition = {
      x: (palmCenter.x - 0.5) * 10,
      y: -(palmCenter.y - 0.5) * 10,
      z: palmCenter.z * 5
    }
    
    setHandPosition(mappedPosition)
  }, [setPinchProgress, setIsOpen, setHandPosition])

  const detect = useCallback(async () => {
    if (!handLandmarkerRef.current || !videoRef.current || videoRef.current.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(detect)
      return
    }

    const results = handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now())

    if (results.landmarks && results.landmarks.length > 0) {
      setIsHandDetected(true)
      detectGestures(results.landmarks[0])
    } else {
      setIsHandDetected(false)
      setHandPosition(null)
      setPinchProgress(0)
      setIsOpen(false)
    }

    animationFrameRef.current = requestAnimationFrame(detect)
  }, [detectGestures, setIsHandDetected, setHandPosition, setPinchProgress, setIsOpen, videoRef])

  useEffect(() => {
    let mounted = true

    const initializeHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1
        })

        if (mounted) {
          handLandmarkerRef.current = handLandmarker
          detect()
        }
      } catch (error) {
        console.error('Error initializing hand landmarker:', error)
      }
    }

    initializeHandLandmarker()

    return () => {
      mounted = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [detect])

  return handLandmarkerRef.current !== null
}
