import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'

import Camera from './Camera'
import World from './World'
import OrbitControls from './OrbitControls'
import Passes from './Passes'
import MatCaps from './MatCaps'

const App = () => {
  return (
    <Canvas
      onCreated={({ gl, size }) => {
        gl.setClearColor(0x000000, 1)
        gl.setPixelRatio(2)
        gl.setSize(size.width, size.height)
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
        <MatCaps />
        <World />
      </Suspense>
    </Canvas>
  )
}

export default App
