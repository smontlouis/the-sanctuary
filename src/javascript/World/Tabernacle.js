import * as THREE from 'three'
import { move } from '../Utils/Animation'

import { state, subscribe } from '../Store'

class Tabernacle {
  constructor () {
    const { resources, worldContainer } = state
    state.objects = {}

    this.instance = resources.items.tabernacle.scene
    this.updateMaterials(this.instance)

    this.instance.rotation.set(Math.PI / 2, 0, 0)
    worldContainer.add(this.instance)

    this.setObjects()
    this.interact()
  }

  updateMaterials (obj) {
    const { materials } = state

    for (const child of obj.children) {
      child.matrixAutoUpdate = false
      child.updateMatrix()

      if (child instanceof THREE.Mesh) {
        let color = null
        switch (child.material.name) {
          case 'Couverture 1':
            color = 'purple'
            child.material = materials.shades.items[color]

            break
          case 'Couverture 2':
            color = 'blue'
            child.material = materials.shades.items[color]

            break
          case 'Couverture 3':
            color = 'beige'
            child.material = materials.shades.items[color]

            break
          case 'Airain':
            color = 'bronze'
            child.material = materials.shades.items[color]

            break
          case 'Gold':
            color = 'gold'
            child.material = materials.shades.items[color]

            break
          case 'Silver':
            color = 'silver'
            child.material = materials.shades.items[color]

            break
          case 'Manne':
          case 'Wood':
          case 'Bread':
          case 'Ground':
          case 'Rope':
            color = 'brown'
            child.material = materials.shades.items[color]

            break
          case 'Pierre':
            color = 'gray'
            child.material = materials.shades.items[color]

            break
          case 'water':
            color = 'blue'
            child.material = materials.shades.items[color]

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
            child.material = materials.shades.items[color]
        }
        child.material.side = THREE.DoubleSide
      }
      if (child.children) {
        this.updateMaterials(child)
      }
    }
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
      'table-de-pierre',
      'tentecut'
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

      return descend(this.instance)
    }

    meshArray.forEach(element => {
      state.objects[element] = lookFor(element)
    })
    console.log(this.instance)
    console.log(state.objects)
  }

  interact () {
    const { objects } = state

    // Show inside of tabernacle
    subscribe(
      ({ isTabernacleOpened }) => ({ isTabernacleOpened }),
      (props) => {
        if (props.isTabernacleOpened) {
          objects.tente.visible = false
          setTimeout(() => {
            objects.murs_to_hide.visible = false
            objects.poteaux_milieu.visible = false
          }, 500)
        } else {
          objects.murs_to_hide.visible = true
          objects.poteaux_milieu.visible = true
          setTimeout(() => {
            objects.tente.visible = true
          }, 500)
        }
      }
    )

    // Deploy tabernacle
    subscribe(
      ({ isTabernacleDeployed }) => ({ isTabernacleDeployed }),
      (props) => {
        if (props.isTabernacleDeployed) {
          objects.tentecut.visible = false
          move(objects.couverture_2, { y: 13, z: objects.couverture_2.position.z - 7 })
          move(objects.couverture_1, { y: 11, z: objects.couverture_1.position.z - 5 }, 0.1)
          move(objects.couverture, { y: 9, z: objects.couverture.position.z - 3 }, 0.2)
          move(objects['converture-lieu-saint'], { y: 7, z: objects['converture-lieu-saint'].position.z - 1 }, 0.3)
          move(objects['couverture-lieu-tres-saint'], { y: 7, z: objects['couverture-lieu-tres-saint'].position.z - 1 }, 0.3)
        } else {

        }
      }
    )
  }
}

export default Tabernacle
