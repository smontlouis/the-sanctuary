import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'

import Camera from './Camera'
import World from './World'
import OrbitControls from './OrbitControls'
import Passes from './Passes'

const App = () => {
  return (
    <Canvas
      pixelRatio={2}
      onCreated={({ gl, size }) => {
        gl.setClearColor(0x000000, 1)
        gl.physicallyCorrectLights = true
        gl.gammaFactor = 2.2
        gl.gammaOutPut = true
        gl.autoClear = false
        gl.toneMappingExposure = 1.13
      }}>
      <Camera />
      <OrbitControls />
      <Passes />
      <Suspense fallback={null}>
        <World />
      </Suspense>
    </Canvas>
  )
}

export default App
