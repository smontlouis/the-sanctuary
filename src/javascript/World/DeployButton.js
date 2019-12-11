import * as THREE from 'three'

import { animateHover } from '../Utils/Animation'
import { state, subscribe, setState } from '../Store'

class DeployButton {
  constructor () {
    this.render()
    this.interact()
  }

  interact () {
    animateHover(this.instance, 0.04, 1)

    const onClick = () => {
      setState({ isTabernacleDeployed: !state.isTabernacleDeployed })
    }
    this.instance.on('click', onClick)
    this.instance.on('touchend', onClick)

    subscribe(
      ({ isTabernacleDeployed }) => ({ isTabernacleDeployed }),
      (state) => {
        console.log('hello', state)
      }
    )
  }

  render () {
    const { resources, objects, worldContainer } = state
    const size = 4
    const geometry = new THREE.PlaneBufferGeometry(size, size / 3)

    const texture = resources.items.deployerLabelTexture
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
    mesh.position.set(5.5, 6, 0.01)
    mesh.rotation.set(0, 0, Math.PI / 2)

    this.instance = objects.deployerLabel = mesh
    worldContainer.add(mesh)
  }
}

export default DeployButton
