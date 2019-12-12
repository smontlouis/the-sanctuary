import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from 'react-three-fiber'

const Camera = props => {
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    setDefaultCamera(ref.current)
  }, [])
  useFrame(() => ref.current.updateMatrixWorld())
  const angleValue = useMemo(() => {
    const angleValue = new THREE.Vector3(1.135, -1.45, 1.15)
    return angleValue
      .clone()
      .normalize()
      .multiplyScalar(80)
  }, [])

  return (
    <perspectiveCamera
      up={[0, 0, 1]}
      fov={40}
      position={angleValue}
      onUpdate={self => self.lookAt(new THREE.Vector3())}
      ref={ref}
      {...props}
    />
  )
}

export default Camera
