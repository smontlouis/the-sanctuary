import * as THREE from 'three'
import { TweenLite } from 'gsap/TweenLite'
import Store from '../Store'

export const updateObjProp = (obj, fn) => {
  if (obj instanceof THREE.Mesh) {
    fn(obj)
  }

  if (obj.children.length) {
    for (const child of obj.children) {
      updateObjProp(child, fn)
    }
  }
}

export const animateHover = (obj, z, opacity) => {
  const originalPositionZ = obj.position.z
  const originalOpacity = obj.material.opacity

  const fnIn = ev => {
    if (Store.state.isTabernacleOpened) return

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
  }

  obj.on('mouseover', fnIn)
  obj.on('touchstart', fnIn)

  const fnOut = ev => {
    document.body.style.cursor = 'default'

    if (Store.state.isTabernacleOpened) return

    const obj = ev.data.target
    if (opacity) {
      updateObjProp(obj, o => {
        TweenLite.to(o.material, 0.3, { opacity: originalOpacity })
      })
    }

    if (z) {
      TweenLite.to(obj.position, 0.3, { z: originalPositionZ })
    }
  }

  obj.on('touchend', fnOut)
  obj.on('mouseout', fnOut)
}

export const fade = (obj, delay = 0, duration = 0.3) => {
  updateObjProp(obj, o => {
    o.material = o.material.clone()
    o.material.depthWrite = false
    o.material.transparent = true
    TweenLite.to(o.material, duration, {
      delay,
      opacity: 0,
      onComplete: () => {
        o.visible = false
      }
    })
  })
}
