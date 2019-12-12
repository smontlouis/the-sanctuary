import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'

import fragmentShader from '../shaders/floor/fragment.glsl'
import vertexShader from '../shaders/floor/vertex.glsl'

const Floor = () => {
  const ref = useRef()
  const uniforms = useMemo(() => {
    const colors = {
      topRight: '#fcb69f',
      topLeft: '#FDD2BB',
      bottomRight: '#f0ddc4',
      bottomLeft: '#ffecd2'
    }

    const topLeft = new THREE.Color(colors.topLeft)
    const topRight = new THREE.Color(colors.topRight)
    const bottomRight = new THREE.Color(colors.bottomRight)
    const bottomLeft = new THREE.Color(colors.bottomLeft)

    const data = new Uint8Array([
      Math.round(bottomLeft.r * 255),
      Math.round(bottomLeft.g * 255),
      Math.round(bottomLeft.b * 255),
      Math.round(bottomRight.r * 255),
      Math.round(bottomRight.g * 255),
      Math.round(bottomRight.b * 255),
      Math.round(topLeft.r * 255),
      Math.round(topLeft.g * 255),
      Math.round(topLeft.b * 255),
      Math.round(topRight.r * 255),
      Math.round(topRight.g * 255),
      Math.round(topRight.b * 255)
    ])
    const backgroundTexture = new THREE.DataTexture(data, 2, 2, THREE.RGBFormat)
    backgroundTexture.magFilter = THREE.LinearFilter
    backgroundTexture.needsUpdate = true

    const uniforms = {
      tBackground: { value: backgroundTexture }
    }

    return uniforms
  }, [])

  return (
    <mesh ref={ref} frustumCulled={false} matrixAutoUpdate={false}>
      <planeBufferGeometry attach="geometry" args={[2, 2, 10, 10]} />
      <shaderMaterial
        attach="material"
        wireframe={false}
        transparent={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default Floor
