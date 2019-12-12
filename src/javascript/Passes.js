import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import BlurPass from './Passes/Blur'
import GlowsPass from './Passes/Glows.js'

extend({ EffectComposer, RenderPass, ShaderPass, UnrealBloomPass })

const Passes = () => {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()
  useEffect(() => {
    composer.current.setSize(size.width, size.height)
  }, [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass
        attachArray="passes"
        args={[GlowsPass]}
        material-uniforms-uPosition-value={[0, 1]}
        material-uniforms-uRadius-value={0.7}
        material-uniforms-uColor-value={new THREE.Color('#fff')}
        material-uniforms-uAlpha-value={0.55}
        renderToScreen
      />
      <shaderPass
        attachArray="passes"
        args={[BlurPass]}
        material-uniforms-uResolution-value={[size.width, size.height]}
        material-uniforms-uStrength-value={[2, 0]}
        renderToScreen
      />
      <shaderPass
        attachArray="passes"
        args={[BlurPass]}
        material-uniforms-uResolution-value={[size.width, size.height]}
        material-uniforms-uStrength-value={[0, 2]}
        renderToScreen
      />
      <unrealBloomPass
        attachArray="passes"
        args={[new THREE.Vector2(window.innerWidth, window.innerHeight), 0, 0, 0]}
      />
    </effectComposer>
  )
}

export default Passes
