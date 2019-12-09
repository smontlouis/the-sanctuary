import * as THREE from 'three'

import { animateHover } from '../Utils/Animation'
import Store from '../Store'

class InterieurButton {
  constructor ({ resources, tabernacle: { objects }, container }) {
    this.resources = resources
    this.objects = objects
    this.container = container

    this.render()
    this.interact()
  }

  interact () {
    animateHover(this.instance, 0.04, 1)

    const onClick = () => {
      Store.setState({ isTabernacleOpened: !Store.state.isTabernacleOpened })
    }
    this.instance.on('click', onClick)
    this.instance.on('touchend', onClick)

    Store.subscribe(
      ({ isTabernacleOpened }) => ({ isTabernacleOpened }),
      (state) => {
        console.log('hello', state)
      }
    )
  }

  render () {
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
    mesh.position.set(5.5, 1, 0.01)
    mesh.rotation.set(0, 0, Math.PI / 2)

    this.instance = this.objects.interieurLabel = mesh
    this.container.add(mesh)
  }
}

export default InterieurButton
