import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TweenLite } from 'gsap/TweenLite'
import { Power1 } from 'gsap/EasePack'

export default class Camera {
  constructor(_options) {
    // Options
    this.time = _options.time
    this.sizes = _options.sizes
    this.renderer = _options.renderer
    this.debug = _options.debug

    // Set up
    this.target = new THREE.Vector3(0, 0, 0)
    this.targetEased = new THREE.Vector3(0, 0, 0)
    this.easing = 0.15

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('camera')
      // this.debugFolder.open()
    }

    this.setAngle()
    this.setInstance()
    // this.setZoom()
    this.setOrbitControls()
  }

  setAngle() {
    // Set up
    this.angle = {}

    // Items
    this.angle.items = {
      default: new THREE.Vector3(1.135, -1.45, 1.15),
      projects: new THREE.Vector3(0.38, -1.4, 1.63)
    }

    // Value
    this.angle.value = new THREE.Vector3()
    this.angle.value.copy(this.angle.items.default)

    // Set method
    this.angle.set = _name => {
      const angle = this.angle.items[_name]
      if (typeof angle !== 'undefined') {
        TweenLite.to(this.angle.value, 2, { ...angle, ease: Power1.easeInOut })
      }
    }

    // Debug
    if (this.debug) {
      this.debugFolder
        .add(this, 'easing')
        .step(0.0001)
        .min(0)
        .max(1)
        .name('easing')
      this.debugFolder
        .add(this.angle.value, 'x')
        .step(0.001)
        .min(-2)
        .max(2)
        .name('invertDirectionX')
        .listen()
      this.debugFolder
        .add(this.angle.value, 'y')
        .step(0.001)
        .min(-2)
        .max(2)
        .name('invertDirectionY')
        .listen()
      this.debugFolder
        .add(this.angle.value, 'z')
        .step(0.001)
        .min(-2)
        .max(2)
        .name('invertDirectionZ')
        .listen()
    }
  }

  setInstance() {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      40,
      this.sizes.viewport.width / this.sizes.viewport.height,
      1,
      1000
    )
    this.instance.up.set(0, 0, 1)
    this.instance.position.copy(this.angle.value)
    this.instance.position.copy(this.targetEased).add(
      this.angle.value
        .clone()
        .normalize()
        .multiplyScalar(80)
    )

    this.instance.lookAt(new THREE.Vector3())

    // Resize event
    this.sizes.on('resize', () => {
      this.instance.aspect =
        this.sizes.viewport.width / this.sizes.viewport.height
      this.instance.updateProjectionMatrix()
    })
  }

  setZoom() {
    // Set up
    this.zoom = {}
    this.zoom.easing = 0.1
    this.zoom.minDistance = 14
    this.zoom.amplitude = 15
    this.zoom.value = 3
    this.zoom.targetValue = this.zoom.value
    this.zoom.distance =
      this.zoom.minDistance + this.zoom.amplitude * this.zoom.value

    // Listen to mousewheel event
    document.addEventListener(
      'mousewheel',
      _event => {
        this.zoom.targetValue += _event.deltaY * 0.001
        this.zoom.targetValue = Math.min(Math.max(this.zoom.targetValue, 0), 1)
      },
      { passive: true }
    )

    // Time tick event
    this.time.on('tick', () => {
      this.zoom.value +=
        (this.zoom.targetValue - this.zoom.value) * this.zoom.easing
      this.zoom.distance =
        this.zoom.minDistance + this.zoom.amplitude * this.zoom.value
    })
  }

  setOrbitControls() {
    // Set up
    this.orbitControls = new OrbitControls(
      this.instance,
      this.renderer.domElement
    )
    this.orbitControls.enabled = true
    // this.orbitControls.enableRotate = false
    this.orbitControls.minPolarAngle = Math.PI / 3.1
    this.orbitControls.maxPolarAngle = Math.PI / 3.1
    this.orbitControls.enablePan = true
    this.orbitControls.zoomSpeed = 0.5
    this.orbitControls.minDistance = 4
    this.orbitControls.maxDistance = 500
    this.orbitControls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    }

    // Debug
    if (this.debug) {
      this.debugFolder
        .add(this.orbitControls, 'enabled')
        .name('orbitControlsEnabled')
    }
  }
}
