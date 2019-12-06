import * as THREE from 'three'

import shaderFragment from '../shaders/matcap/fragment.glsl'
import shaderVertex from '../shaders/matcap/vertex.glsl'

export default function() {
  const material = new THREE.MeshMatcapMaterial()

  return material
}
