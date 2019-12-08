import * as THREE from 'three'
import { Interaction } from 'three.interaction'
import { TweenLite } from 'gsap/TweenLite'

const updateObjProp = (obj, fn) => {
  if (obj instanceof THREE.Mesh) {
    fn(obj)
  }

  if (obj.children.length) {
    for (const child of obj.children) {
      updateObjProp(child, fn)
    }
  }
}

const animateHover = (obj, z, opacity) => {
  const originalPositionZ = obj.position.z
  const originalOpacity = obj.material.opacity

  obj.on('mouseover', ev => {
    document.body.style.cursor = 'pointer'
    if (opacity) {
      updateObjProp(obj, o => {
        o.material = o.material.clone()
        TweenLite.to(o.material, 0.3, { opacity: opacity })
      })
    }

    if (z) {
      TweenLite.to(obj.position, 0.3, { z: originalPositionZ + z })
    }
  })

  obj.on('mouseout', ev => {
    document.body.style.cursor = 'default'

    const obj = ev.data.target
    if (opacity) {
      updateObjProp(obj, o => {
        TweenLite.to(o.material, 0.3, { opacity: originalOpacity })
      })
    }

    if (z) {
      TweenLite.to(obj.position, 0.3, { z: originalPositionZ })
    }
  })
}

const fade = (obj, delay = 0, duration = 0.3) => {
  updateObjProp(obj, o => {
    o.material = o.material.clone()
    o.material.depthWrite = false
    o.material.transparent = true
    TweenLite.to(o.material, duration, { delay, opacity: 0 })
  })
}

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
    this.objects = _options.objects
    this.scene = _options.scene

    const interaction = new Interaction(
      this.renderer,
      this.scene,
      this.camera.instance
    )

    animateHover(this.objects.interieurLabel, 0.04, 1)

    this.objects.interieurLabel.on('click', () => {
      fade(this.objects.tente)
      setTimeout(() => {
        fade(this.objects.murs_to_hide)
        fade(this.objects.poteaux_milieu)
      }, 1000)
    })

    console.log(this.objects)
  }
}
