import * as THREE from 'three'
import * as dat from 'dat.gui'
import { Interaction } from 'three.interaction'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import World from './World/index.js'
import Resources from './Resources.js'
import { state } from './Store'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js'

import BlurPass from './Passes/Blur.js'
import GlowsPass from './Passes/Glows.js'
import Camera from './Camera.js'

export default class Application {
  constructor (_options) {
    // Options
    const $canvas = _options.$canvas

    // Set up
    const time = new Time()
    const sizes = new Sizes()
    const resources = new Resources()
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      alpha: true
    })
    let debug

    state.time = time
    state.sizes = sizes
    state.resources = resources
    state.debug = debug
    state.$canvas = $canvas
    state.scene = scene
    state.renderer = renderer

    if (window.location.hash === '#debug') {
      debug = new dat.GUI({ width: 420, closed: true })
    }

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setPasses()

    resources.on('ready', () => {
      this.setWorld()
    })
  }

  setConfig () {
    const { world, passes, config = {} } = state
    config.touch = false

    state.config = config

    window.addEventListener(
      'touchstart',
      () => {
        config.touch = true
        world.controls.setTouch()

        passes.horizontalBlurPass.strength = 1
        passes.horizontalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(
          passes.horizontalBlurPass.strength,
          0
        )
        passes.verticalBlurPass.strength = 1
        passes.verticalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(
          0,
          passes.verticalBlurPass.strength
        )
      },
      { once: true }
    )
  }

  setRenderer () {
    const { renderer, sizes } = state

    renderer.setClearColor(0x000000, 1)
    renderer.setPixelRatio(2)
    renderer.setSize(sizes.viewport.width, sizes.viewport.height)
    renderer.physicallyCorrectLights = true
    renderer.gammaFactor = 2.2
    renderer.gammaOutPut = true
    renderer.autoClear = false
    renderer.toneMappingExposure = 1.13

    // Resize event
    sizes.on('resize', () => {
      renderer.setSize(
        sizes.viewport.width,
        sizes.viewport.height
      )
    })
  }

  setCamera () {
    const { renderer, scene } = state
    state.camera = new Camera()
    const { camera } = state

    scene.add(camera.instance)

    new Interaction(
      renderer,
      scene,
      camera.instance
    )
  }

  setPasses () {
    state.passes = {}
    const { time, sizes, renderer, debug, scene, camera, config, passes } = state

    // Debug
    if (debug) {
      passes.debugFolder = debug.addFolder('postprocess')
      // passes.debugFolder.open()
    }

    passes.composer = new EffectComposer(renderer)

    // Create passes
    passes.renderPass = new RenderPass(scene, camera.instance)

    // Horizontal Pass
    passes.horizontalBlurPass = new ShaderPass(BlurPass)
    passes.horizontalBlurPass.strength = config.touch ? 0 : 1
    passes.horizontalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(
      sizes.viewport.width,
      sizes.viewport.height
    )
    passes.horizontalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(
      passes.horizontalBlurPass.strength,
      0
    )

    // Vertical Pass
    passes.verticalBlurPass = new ShaderPass(BlurPass)
    passes.verticalBlurPass.strength = config.touch ? 0 : 1
    passes.verticalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(
      sizes.viewport.width,
      sizes.viewport.height
    )
    passes.verticalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(
      0,
      passes.verticalBlurPass.strength
    )

    // Debug
    if (debug) {
      const folder = passes.debugFolder.addFolder('blur')

      folder
        .add(
          passes.horizontalBlurPass.material.uniforms.uStrength.value,
          'x'
        )
        .step(0.001)
        .min(0)
        .max(10)
      folder
        .add(
          passes.verticalBlurPass.material.uniforms.uStrength.value,
          'y'
        )
        .step(0.001)
        .min(0)
        .max(10)
    }

    // Glow pass
    passes.glowsPass = new ShaderPass(GlowsPass)
    passes.glowsPass.color = '#fff'
    passes.glowsPass.material.uniforms.uPosition.value = new THREE.Vector2(
      0,
      1
    )
    passes.glowsPass.material.uniforms.uRadius.value = 0.7
    passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(
      passes.glowsPass.color
    )
    passes.glowsPass.material.uniforms.uAlpha.value = 0.55

    // Debug
    if (debug) {
      const folder = passes.debugFolder.addFolder('glows')

      folder
        .add(passes.glowsPass.material.uniforms.uPosition.value, 'x')
        .step(0.001)
        .min(-1)
        .max(2)
        .name('positionX')
      folder
        .add(passes.glowsPass.material.uniforms.uPosition.value, 'y')
        .step(0.001)
        .min(-1)
        .max(2)
        .name('positionY')
      folder
        .add(passes.glowsPass.material.uniforms.uRadius, 'value')
        .step(0.001)
        .min(0)
        .max(2)
        .name('radius')
      folder
        .addColor(passes.glowsPass, 'color')
        .name('color')
        .onChange(() => {
          passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(
            passes.glowsPass.color
          )
        })
      folder
        .add(passes.glowsPass.material.uniforms.uAlpha, 'value')
        .step(0.001)
        .min(0)
        .max(1)
        .name('alpha')
    }

    passes.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0,
      0,
      0
    )
    passes.bloomPass.strength = 0.12
    passes.bloomPass.radius = 0
    passes.bloomPass.threshold = 0

    // Debug
    if (debug) {
      const folder = passes.debugFolder.addFolder('bloom')

      folder
        .add(passes.bloomPass, 'threshold')
        .step(0.001)
        .min(0)
        .max(1)
      folder
        .add(passes.bloomPass, 'strength')
        .step(0.001)
        .min(0)
        .max(3)

      folder
        .add(passes.bloomPass, 'radius')
        .step(0.001)
        .min(0)
        .max(1)
    }

    passes.pixelPass = new ShaderPass(PixelShader)
    passes.pixelPass.pixelSize = 4
    passes.pixelPass.uniforms.resolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    )
    passes.pixelPass.uniforms.resolution.value.multiplyScalar(
      window.devicePixelRatio
    )

    // Debug
    if (debug) {
      const folder = passes.debugFolder.addFolder('pixelSize')

      folder
        .add(passes.pixelPass, 'pixelSize')
        .step(2)
        .min(2)
        .max(32)
    }

    // Add passes
    passes.composer.addPass(passes.renderPass)
    passes.composer.addPass(passes.bloomPass)
    passes.composer.addPass(passes.horizontalBlurPass)
    passes.composer.addPass(passes.verticalBlurPass)
    // passes.composer.addPass(passes.pixelPass)

    passes.composer.addPass(passes.glowsPass)

    // Time tick
    time.on('tick', () => {
      passes.horizontalBlurPass.enabled =
        passes.horizontalBlurPass.material.uniforms.uStrength.value.x > 0
      passes.verticalBlurPass.enabled =
        passes.verticalBlurPass.material.uniforms.uStrength.value.y > 0
      passes.pixelPass.uniforms.pixelSize.value = passes.pixelPass.pixelSize

      // Renderer
      passes.composer.render()
      // renderer.domElement.style.background = 'black'
      // renderer.render(scene, camera.instance)
    })

    // Resize event
    sizes.on('resize', () => {
      renderer.setSize(
        sizes.viewport.width,
        sizes.viewport.height
      )
      passes.composer.setSize(
        sizes.viewport.width,
        sizes.viewport.height
      )
      passes.horizontalBlurPass.material.uniforms.uResolution.value.x = sizes.viewport.width
      passes.horizontalBlurPass.material.uniforms.uResolution.value.y = sizes.viewport.height
      passes.verticalBlurPass.material.uniforms.uResolution.value.x = sizes.viewport.width
      passes.verticalBlurPass.material.uniforms.uResolution.value.y = sizes.viewport.height
      passes.pixelPass.uniforms.resolution.value
        .set(window.innerWidth, window.innerHeight)
        .multiplyScalar(window.devicePixelRatio)
    })
  }

  setWorld () {
    const { scene } = state
    state.world = new World()

    scene.add(state.world.container)
  }

  destructor () {
    const { time, sizes, camera, renderer, debug } = state
    time.off('tick')
    sizes.off('resize')

    camera.orbitControls.dispose()
    renderer.dispose()
    debug && debug.destroy()
  }
}
