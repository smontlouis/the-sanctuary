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

export default class {
  constructor(_options) {
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

    this.objects.cuve.on('mouseover', ev => {
      const obj = ev.data.target
      console.log(obj)

      document.body.style.cursor = 'pointer'
      updateObjProp(obj, o => {
        TweenLite.to(o.material, 0.3, { opacity: 0 })
      })

      TweenLite.to(obj.position, 0.3, { z: 0.05 })
    })

    this.objects.cuve.on('mouseout', ev => {
      document.body.style.cursor = 'default'

      const obj = ev.data.target
      updateObjProp(obj, o => {
        TweenLite.to(o.material, 0.3, { opacity: 1 })
      })

      TweenLite.to(obj.position, 0.3, { z: 0.01 })
    })

    console.log(this.objects)
  }
}
