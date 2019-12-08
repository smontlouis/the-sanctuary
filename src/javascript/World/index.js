import * as THREE from 'three'
import Floor from './Floor.js'
import Materials from './Materials.js'
import Interaction from './Interaction.js'

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
    this.scene = _options.scene

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('world')
    }

    // Set up
    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    // this.setAxes()
    this.setFloor()
    this.setMaterials()
    this.setTabernacle()
    this.setObjects()
    this.setFloorShadow()
    this.setLabels()
    this.setInteraction()
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

  setMaterials () {
    this.materials = new Materials({
      resources: this.resources,
      debug: this.debugFolder
    })
  }

  updateMaterials (obj) {
    for (const child of obj.children) {
      child.matrixAutoUpdate = false
      child.updateMatrix()

      if (child instanceof THREE.Mesh) {
        let color = null
        console.log(child.material.name)
        switch (child.material.name) {
          case 'Couverture 1':
            color = 'purple'
            child.material = this.materials.shades.items[color]

            break
          case 'Couverture 2':
            color = 'blue'
            child.material = this.materials.shades.items[color]

            break
          case 'Couverture 3':
            color = 'beige'
            child.material = this.materials.shades.items[color]

            break
          case 'Airain':
            color = 'bronze'
            child.material = this.materials.shades.items[color]

            break
          case 'Gold':
            color = 'gold'
            child.material = this.materials.shades.items[color]

            break
          case 'Silver':
            color = 'silver'
            child.material = this.materials.shades.items[color]

            break
          case 'Manne':
          case 'Wood':
          case 'Bread':
          case 'Ground':
          case 'Rope':
            color = 'brown'
            child.material = this.materials.shades.items[color]

            break
          case 'Pierre':
            color = 'gray'
            child.material = this.materials.shades.items[color]

            break
          case 'water':
            color = 'blue'
            child.material = this.materials.shades.items[color]

            break
          case 'Bougie':
            child.material = new THREE.MeshLambertMaterial({
              emissive: '#ffca00'
            })

            break
          case 'Drap':
          case 'Ground 2':
          default:
            color = 'white'
            child.material = this.materials.shades.items[color]
        }
        child.material.side = THREE.DoubleSide
      }
      if (child.children) {
        this.updateMaterials(child)
      }
    }
  }

  setTabernacle () {
    this.tabernacle = this.resources.items.tabernacle.scene
    this.updateMaterials(this.tabernacle)

    this.tabernacle.rotation.set(Math.PI / 2, 0, 0)

    this.container.add(this.tabernacle)
  }

  setObjects () {
    const meshArray = [
      'tente',
      'couverture',
      'couverture_1',
      'couverture_2',
      'converture-lieu-saint',
      'couverture-lieu-tres-saint',
      'plots',
      'murs',
      'murs_to_hide',
      'aies',
      'mur-west',
      'clou-rope',
      'cuve',
      'eau',
      'kolam_basuh',
      'cloture',
      'autel',
      'autel-barres',
      'autel-base',
      'autel-cornes',
      'poteaux-interieurs',
      'poteaux_milieu',
      'table-des-pains',
      'bol-1',
      'bol-2',
      'bread',
      'carafe',
      'table',
      'chandelier',
      'chandelier-base',
      'chandelier-lumieres',
      'altar',
      'tabernacle',
      'baton-aaron',
      'bol-de-manne',
      'propitiatoire',
      'tabernacle-base',
      'table-de-pierre'
    ]

    const lookFor = name => {
      const descend = object => {
        if (object.name === name) {
          return object
        }
        for (const child of object.children) {
          const found = descend(child)
          if (found) {
            return found
          }
        }
      }

      return descend(this.tabernacle)
    }
    console.log(this.tabernacle)

    this.objects = {}
    meshArray.forEach(element => {
      this.objects[element] = lookFor(element)
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
    // Label
    const size = 4
    const geometry = new THREE.PlaneBufferGeometry(size, size / 3)
    const texture = this.resources.items.interieurLabelTexture
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.LinearFilter

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      alphaMap: texture,
      color: 0x355069,
      depthWrite: false,
      opacity: 0.4
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 5.5
    mesh.position.y = 1
    mesh.position.z = 0.01
    mesh.rotation.set(0, 0, Math.PI / 2)
    this.objects.interieurLabel = mesh
    this.container.add(mesh)
  }

  setInteraction () {
    this.interactions = new Interaction({
      config: this.config,
      debug: this.debug,
      resources: this.resources,
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
      passes: this.passes,
      objects: this.objects,
      scene: this.scene
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
