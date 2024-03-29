import * as THREE from 'three'

import { animateHover } from '../Utils/Animation'
import { state, subscribe, setState } from '../Store'

class InterieurButton {
  constructor () {
    this.render()
    this.interact()
  }

  interact () {
    animateHover(this.instance, 0.04, 1)

    const onClick = () => {
      setState({ isTabernacleOpened: !state.isTabernacleOpened })
    }
    this.instance.on('click', onClick)
    this.instance.on('touchend', onClick)

    subscribe(
      ({ isTabernacleOpened }) => ({ isTabernacleOpened }),
      (state) => {
        console.log('hello', state)
      }
    )
  }

  render () {
    const { resources, objects, worldContainer } = state
    const size = 4
    const geometry = new THREE.PlaneBufferGeometry(size, size / 3)

    const texture = resources.items.interieurLabelTexture
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
    mesh.position.set(5.5, 1, 0.01)
    mesh.rotation.set(0, 0, Math.PI / 2)

    this.instance = objects.interieurLabel = mesh
    worldContainer.add(mesh)
  }
}

export default InterieurButton
