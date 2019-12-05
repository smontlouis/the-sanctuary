import { Interaction } from 'three.interaction'

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

    this.objects.tente.on('mouseover', function(ev) {
      console.log(ev)
    })

    console.log(this.objects)
  }
}
