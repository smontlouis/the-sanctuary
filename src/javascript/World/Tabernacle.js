import * as THREE from 'three'

import { fade } from '../Utils/Animation'
import Store from '../Store'

class Tabernacle {
  constructor ({ resources, container, materials }) {
    this.materials = materials
    this.objects = {}

    this.tabernacle = resources.items.tabernacle.scene
    this.updateMaterials(this.tabernacle)

    this.tabernacle.rotation.set(Math.PI / 2, 0, 0)
    container.add(this.tabernacle)

    this.setObjects()
    this.interact()
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

    meshArray.forEach(element => {
      this.objects[element] = lookFor(element)
    })
  }

  interact () {
    Store.subscribe(
      ({ isTabernacleOpened }) => ({ isTabernacleOpened }),
      (props) => {
        if (props.isTabernacleOpened) {
          fade(this.objects.tente)
          setTimeout(() => {
            fade(this.objects.murs_to_hide)
            fade(this.objects.poteaux_milieu)
          }, 1000)
        } else {
          console.log('appear')
        }
      }
    )
  }
}

export default Tabernacle
