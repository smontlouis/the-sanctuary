import * as THREE from 'three'
import Floor from './Floor.js'
import Materials from './Materials.js'
import { TweenLite } from 'gsap/TweenLite'

export default class {
  constructor(_options) {
    // Options
    this.config = _options.config
    this.debug = _options.debug
    this.resources = _options.resources
    this.time = _options.time
    this.sizes = _options.sizes
    this.camera = _options.camera
    this.renderer = _options.renderer
    this.passes = _options.passes

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('world')
      this.debugFolder.open()
    }

    // Set up
    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    this.setAxes()
    this.setFloor()
    this.setMaterials()
    this.setTabernacle()
    this.setFloorShadow()
    this.setReveal()
  }

  setAxes() {
    this.axis = new THREE.AxesHelper()
    this.container.add(this.axis)
  }

  setFloor() {
    this.floor = new Floor({
      debug: this.debugFolder
    })

    this.container.add(this.floor.container)
  }

  setMaterials() {
    this.materials = new Materials({
      resources: this.resources,
      debug: this.debugFolder
    })
  }

  updateMaterials(obj) {
    for (const child of obj.children) {
      if (child instanceof THREE.Mesh) {
        console.log(child.material.name)

        let color = null
        switch (child.material.name) {
          case 'Gold':
            color = 'orange'
            break
          case 'Manne':
          case 'Airain':
          case 'Wood':
          case 'Bread':
          case 'Ground':
          case 'Rope':
            color = 'brown'
            break
          case 'Silver':
          case 'Pierre':
            color = 'gray'
            break
          case 'Bougie':
            color = 'yellow'
            break
          case 'water':
            color = 'blue'
            break
          case 'Drap':
          case 'Ground 2':
          default:
            color = 'white'
        }
        child.material = this.materials.shades.items[color]
        child.material.side = THREE.DoubleSide
      }
      if (child.children) {
        this.updateMaterials(child)
      }
    }
  }

  setTabernacle() {
    const tabernacle = this.resources.items.tabernacle.scene

    this.updateMaterials(tabernacle)
    tabernacle.rotation.set(Math.PI / 2, 0, 0)

    this.container.add(this.resources.items.tabernacle.scene)
  }

  setFloorShadow() {
    // Create floor manually because of missing UV
    const geometry = new THREE.PlaneBufferGeometry(62.5, 62.5, 0, 0)
    const material = this.materials.items.floorShadow.clone()

    material.uniforms.tShadow.value = this.resources.items.floorShadowTexture
    material.uniforms.uShadowColor.value = new THREE.Color(
      this.materials.items.floorShadow.shadowColor
    )
    material.uniforms.uAlpha.value = 0

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(-0.05, 0, 0)
    // mesh.matrixAutoUpdate = false
    // mesh.updateMatrix()

    this.floorShadows = []
    this.floorShadows.push(mesh)
    this.container.add(mesh)
  }

  setReveal() {
    this.reveal = {}
    this.reveal.matcapsProgress = 0
    this.reveal.floorShadowsProgress = 0
    this.reveal.previousMatcapsProgress = null
    this.reveal.previousFloorShadowsProgress = null

    // Go method
    this.reveal.go = () => {
      TweenLite.fromTo(
        this.reveal,
        2,
        { matcapsProgress: 0 },
        { matcapsProgress: 1 }
      )
      TweenLite.fromTo(
        this.reveal,
        2,
        { floorShadowsProgress: 0 },
        { floorShadowsProgress: 1, delay: 0.5 }
      )

      // Time tick
      this.time.on('tick', () => {
        // Matcap progress changed
        if (
          this.reveal.matcapsProgress !== this.reveal.previousMatcapsProgress
        ) {
          // Update each material
          for (const _materialKey in this.materials.shades.items) {
            const material = this.materials.shades.items[_materialKey]
            material.uniforms.uRevealProgress.value = this.reveal.matcapsProgress
          }

          // Save
          this.reveal.previousMatcapsProgress = this.reveal.matcapsProgress
        }

        // Matcap progress changed
        if (
          this.reveal.floorShadowsProgress !==
          this.reveal.previousFloorShadowsProgress
        ) {
          // Update each floor shadow
          for (const _mesh of this.floorShadows) {
            _mesh.material.uniforms.uAlpha.value = this.reveal.floorShadowsProgress
          }

          // Save
          this.reveal.previousFloorShadowsProgress = this.reveal.floorShadowsProgress
        }
      })

      // Debug
      if (this.debug) {
        this.debugFolder
          .add(this.reveal, 'matcapsProgress')
          .step(0.0001)
          .min(0)
          .max(1)
          .name('matcapsProgress')
        this.debugFolder
          .add(this.reveal, 'floorShadowsProgress')
          .step(0.0001)
          .min(0)
          .max(1)
          .name('floorShadowsProgress')
        this.debugFolder.add(this.reveal, 'go').name('reveal')
      }
    }

    this.reveal.go()
  }
}
