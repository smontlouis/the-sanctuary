import React, { useEffect } from 'react'
import * as THREE from 'three'
import { useLoader, useUpdate } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import useStore from '../Store/store'

const Tabernacle = () => {
  const matcaps = useStore(s => s.matcaps)
  const gltf = useLoader(GLTFLoader, '/base.glb', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    loader.setDRACOLoader(dracoLoader)
  })

  const updateMaterials = (obj, matcaps) => {
    for (const child of obj.children) {
      child.matrixAutoUpdate = false
      child.updateMatrix()

      if (child instanceof THREE.Mesh) {
        switch (child.material.name) {
          case 'Couverture 1':
            child.material = matcaps.matcapPurple
            break
          case 'Couverture 2':
            child.material = matcaps.matcapBlue
            break
          case 'Couverture 3':
            child.material = matcaps.matcapBeige
            break
          case 'Airain':
            child.material = matcaps.matcapBronze
            break
          case 'Gold':
            child.material = matcaps.matcapGold
            break
          case 'Silver':
            child.material = matcaps.matcapSilver
            break
          case 'Manne':
          case 'Wood':
          case 'Bread':
          case 'Ground':
          case 'Rope':
            child.material = matcaps.matcapBrown
            break
          case 'Pierre':
            child.material = matcaps.matcapGray
            break
          case 'water':
            child.material = matcaps.matcapBlue
            break
          case 'Bougie':
            child.material = new THREE.MeshLambertMaterial({
              emissive: '#ffca00'
            })
            break
          case 'Drap':
          case 'Ground 2':
          default:
            child.material = matcaps.matcapWhite
        }
        child.material.side = THREE.DoubleSide
      }
      if (child.children) {
        updateMaterials(child, matcaps)
      }
    }
  }

  const ref = useUpdate(
    obj => {
      updateMaterials(obj, matcaps)
    },
    [matcaps, gltf] // execute only if these properties change
  )

  console.log(gltf.scene)
  return <primitive ref={ref} object={gltf.scene} rotation={[Math.PI / 2, 0, 0]} />
}

export default Tabernacle
