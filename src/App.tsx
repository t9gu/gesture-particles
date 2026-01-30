import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ParticleSystem } from './components/ParticleSystem'
import { Starfield } from './components/Starfield'
import { ControlPanel } from './components/ControlPanel'

function App() {
  return (
    <div className="w-full h-full bg-black">
      <ControlPanel />
      
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <Starfield />
        <ParticleSystem />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={30}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}

export default App
