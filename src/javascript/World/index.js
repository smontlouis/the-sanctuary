import * as THREE from 'three'

import Floor from './Floor.js'
import Materials from './Materials.js'
import Tabernacle from './Tabernacle.js'
import InterieurButton from './InterieurButton'
export default class {
  constructor (_options) {
    // Options
    this.config = _options.config
    this.debug = _options.debug
    this.resources = _options.resources
    this.time = _options.time
    this.sizes = _options.sizes
    this.camera = _options.camera
    this.renderer = _options.renderer
    this.passes = _options.passes

    this.materials = new Materials({
      resources: this.resources,
      debug: this.debugFolder
    })

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('world')
    }

    // Set up
    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    // this.setAxes()
    this.setFloor()
    this.setFloorShadow()
    this.setTabernacle()
    this.setLabels()
    this.setReveal()
  }

  setAxes () {
    this.axis = new THREE.AxesHelper()
    this.container.add(this.axis)
  }

  setFloor () {
    this.floor = new Floor({
      debug: this.debugFolder
    })

    this.container.add(this.floor.container)
  }

  setTabernacle () {
    this.tabernacle = new Tabernacle({
      resources: this.resources,
      container: this.container,
      materials: this.materials
    })
  }

  setFloorShadow () {
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
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()

    this.floorShadows = []
    this.floorShadows.push(mesh)
    this.container.add(mesh)
  }

  setLabels () {
    new InterieurButton({
      resources: this.resources,
      tabernacle: this.tabernacle,
      container: this.container
    })
  }

  setReveal () {
    this.reveal = {}
    this.reveal.floorShadowsProgress = 1
    this.reveal.previousFloorShadowsProgress = null

    // Go method
    this.reveal.go = () => {
      // Time tick
      this.time.on('tick', () => {
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
