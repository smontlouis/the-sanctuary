import * as THREE from 'three'
import React, { useRef } from 'react'
import { useThree, extend } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

const Controls = () => {
  const { gl, camera } = useThree()
  const ref = useRef()
  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      minPolarAngle={Math.PI / 3.1}
      maxPolarAngle={Math.PI / 3.1}
      zoomSpeed={0.5}
      minDistance={4}
      maxDistance={500}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
      }}
    />
  )
}

export default Controls
