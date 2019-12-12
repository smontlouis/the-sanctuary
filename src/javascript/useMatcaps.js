import * as THREE from 'three'
import { useLoader } from 'react-three-fiber'
import useStore from './Store/store'

import matcapGoldSource from '../models/matcaps/gold.png'
import matcapSilverSource from '../models/matcaps/silver.png'
import matcapBeigeSource from '../models/matcaps/beige.png'
import matcapBronzeSource from '../models/matcaps/bronze.png'
import matcapBlackSource from '../models/matcaps/black.png'
import matcapOrangeSource from '../models/matcaps/orange.png'
import matcapRedSource from '../models/matcaps/red.png'
import matcapWhiteSource from '../models/matcaps/white.png'
import matcapGreenSource from '../models/matcaps/green.png'
import matcapBrownSource from '../models/matcaps/brown.png'
import matcapGraySource from '../models/matcaps/gray.png'
import matcapEmeraldGreenSource from '../models/matcaps/emeraldGreen.png'
import matcapPurpleSource from '../models/matcaps/purple.png'
import matcapBlueSource from '../models/matcaps/blue.png'
import matcapYellowSource from '../models/matcaps/yellow.png'

const resources = [
  { texture: matcapGoldSource, name: 'matcapGold' },
  { texture: matcapSilverSource, name: 'matcapSilver' },
  { texture: matcapBeigeSource, name: 'matcapBeige' },
  { texture: matcapBronzeSource, name: 'matcapBronze' },
  { texture: matcapBlackSource, name: 'matcapBlack' },
  { texture: matcapOrangeSource, name: 'matcapOrange' },
  { texture: matcapRedSource, name: 'matcapRed' },
  { texture: matcapWhiteSource, name: 'matcapWhite' },
  { texture: matcapGreenSource, name: 'matcapGreen' },
  { texture: matcapBrownSource, name: 'matcapBrown' },
  { texture: matcapGraySource, name: 'matcapGray' },
  { texture: matcapEmeraldGreenSource, name: 'matcapEmeraldGreen' },
  { texture: matcapPurpleSource, name: 'matcapPurple' },
  { texture: matcapBlueSource, name: 'matcapBlue' },
  { texture: matcapYellowSource, name: 'matcapYellow' }
]

const useMatcaps = () => {
  const setMatcaps = useStore(state => state.setMatcaps)
  const textures = useLoader(
    THREE.TextureLoader,
    resources.map(c => c.texture)
  )

  const materials = textures
    .map((texture, i) => {
      const material = new THREE.MeshMatcapMaterial()
      material.name = resources[i].name
      material.matcap = texture
      return material
    })
    .reduce((acc, curr) => {
      acc[curr.name] = curr
      return acc
    }, {})

  setMatcaps(materials)
}

export default useMatcaps
