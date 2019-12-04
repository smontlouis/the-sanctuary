import * as THREE from 'three'

import Loader from './Utils/Loader.js'
import EventEmitter from './Utils/EventEmitter.js'

// Matcaps
import matcapBeigeSource from '../models/matcaps/beige.png'
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
import floorShadowSource from '../models/static/floorShadow.png'

// Intro
import tabernacle from '../models/tabernacle/base.glb'

export default class Resources extends EventEmitter {
  constructor() {
    super()

    this.loader = new Loader()
    this.items = {}

    this.loader.load([
      // Matcaps
      { name: 'matcapBeige', source: matcapBeigeSource, type: 'texture' },
      { name: 'matcapBlack', source: matcapBlackSource, type: 'texture' },
      { name: 'matcapOrange', source: matcapOrangeSource, type: 'texture' },
      { name: 'matcapRed', source: matcapRedSource, type: 'texture' },
      { name: 'matcapWhite', source: matcapWhiteSource, type: 'texture' },
      { name: 'matcapGreen', source: matcapGreenSource, type: 'texture' },
      { name: 'matcapBrown', source: matcapBrownSource, type: 'texture' },
      { name: 'matcapGray', source: matcapGraySource, type: 'texture' },
      {
        name: 'matcapEmeraldGreen',
        source: matcapEmeraldGreenSource,
        type: 'texture'
      },
      { name: 'matcapPurple', source: matcapPurpleSource, type: 'texture' },
      { name: 'matcapBlue', source: matcapBlueSource, type: 'texture' },
      { name: 'matcapYellow', source: matcapYellowSource, type: 'texture' },
      { name: 'floorShadow', source: floorShadowSource, type: 'texture' },

      // Temple
      { name: 'tabernacle', source: tabernacle }
    ])

    this.loader.on('fileEnd', (_resource, _data) => {
      this.items[_resource.name] = _data

      // Texture
      if (_resource.type === 'texture') {
        const texture = new THREE.Texture(_data)
        texture.needsUpdate = true

        this.items[`${_resource.name}Texture`] = texture
      }

      // Trigger progress
      this.trigger('progress', [this.loader.loaded / this.loader.toLoad])
    })

    this.loader.on('end', () => {
      // Trigger ready
      this.trigger('ready')
    })
  }
}
