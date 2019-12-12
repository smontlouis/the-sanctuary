import * as THREE from 'three'

import Floor from './Floor.js'
import Materials from './Materials.js'
import Tabernacle from './Tabernacle.js'
import InterieurButton from './InterieurButton'
import DeployButton from './DeployButton'

import { state } from '../Store'

export default class {
  constructor(_options) {
    const { debug, resources } = state

    state.materials = new Materials({
      resources,
      debug: this.debugFolder
    })

    // Debug
    if (debug) {
      this.debugFolder = debug.addFolder('world')
    }

    // Set up
    state.worldContainer = this.container = new THREE.Object3D()
    state.worldContainer.matrixAutoUpdate = false

    // this.setAxes()
    this.setFloor()
    this.setFloorShadow()
    this.setTabernacle()
    this.setLabels()
    this.setReveal()
  }

  setAxes() {
    this.axis = new THREE.AxesHelper()
    state.worldContainer.add(this.axis)
  }

  setFloor() {
    this.floor = new Floor({
      debug: this.debugFolder
    })

    state.worldContainer.add(this.floor.container)
  }

  setTabernacle() {
    state.tabernacle = new Tabernacle()
  }

  setFloorShadow() {
    const { resources, materials, worldContainer } = state
    // Create floor manually because of missing UV
    const geometry = new THREE.PlaneBufferGeometry(62.5, 62.5, 0, 0)
    const material = materials.items.floorShadow.clone()

    material.uniforms.tShadow.value = resources.items.floorShadowTexture
    material.uniforms.uShadowColor.value = new THREE.Color(materials.items.floorShadow.shadowColor)
    material.uniforms.uAlpha.value = 0

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(-0.05, 0, 0)
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()

    this.floorShadows = []
    this.floorShadows.push(mesh)
    worldContainer.add(mesh)
  }

  setLabels() {
    new InterieurButton()
    new DeployButton()
  }

  setReveal() {
    const { debug, time } = state
    this.reveal = {}
    this.reveal.floorShadowsProgress = 1
    this.reveal.previousFloorShadowsProgress = null

    // Go method
    this.reveal.go = () => {
      // Time tick
      time.on('tick', () => {
        // Matcap progress changed
        if (this.reveal.floorShadowsProgress !== this.reveal.previousFloorShadowsProgress) {
          // Update each floor shadow
          for (const _mesh of this.floorShadows) {
            _mesh.material.uniforms.uAlpha.value = this.reveal.floorShadowsProgress
          }

          // Save
          this.reveal.previousFloorShadowsProgress = this.reveal.floorShadowsProgress
        }
      })

      // Debug
      if (debug) {
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
