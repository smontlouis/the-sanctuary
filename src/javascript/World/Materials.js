import * as THREE from 'three'
import FloorShadowMaterial from '../Materials/FloorShadow.js'
import MatcapMaterial from '../Materials/MatCap.js'

export default class Materials {
  constructor (_options) {
    // Options
    this.resources = _options.resources
    this.debug = _options.debug

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('materials')
    }

    // Set up
    this.items = {}

    this.setPures()
    this.setShades()
    this.setFloorShadow()
  }

  setPures () {
    // Setup
    this.pures = {}
    this.pures.items = {}
    this.pures.items.red = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    this.pures.items.red.name = 'pureRed'
    this.pures.items.white = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.pures.items.white.name = 'pureWhite'
    this.pures.items.yellow = new THREE.MeshBasicMaterial({ color: 0xffe889 })
    this.pures.items.yellow.name = 'pureYellow'
  }

  setShades () {
    // Setup
    this.shades = {}
    this.shades.items = {}
    this.shades.indirectColor = '#ffefd4'

    this.shades.uniforms = {
      uRevealProgress: 0,
      uIndirectDistanceAmplitude: 1.75,
      uIndirectDistanceStrength: 0.5,
      uIndirectDistancePower: 2.0,
      uIndirectAngleStrength: 1.5,
      uIndirectAngleOffset: 0.6,
      uIndirectAnglePower: 1.0,
      uIndirectColor: null
    }

    // White
    this.shades.items.white = new MatcapMaterial()
    this.shades.items.white.name = 'shadeWhite'
    this.shades.items.white.matcap = this.resources.items.matcapWhiteTexture
    this.items.white = this.shades.items.white

    // Orange
    this.shades.items.orange = new MatcapMaterial()
    this.shades.items.orange.name = 'shadeOrange'
    this.shades.items.orange.matcap = this.resources.items.matcapOrangeTexture
    this.items.orange = this.shades.items.orange

    // Green
    this.shades.items.green = new MatcapMaterial()
    this.shades.items.green.name = 'shadeGreen'
    this.shades.items.green.matcap = this.resources.items.matcapGreenTexture
    this.items.green = this.shades.items.green

    // Brown
    this.shades.items.brown = new MatcapMaterial()
    this.shades.items.brown.name = 'shadeBrown'
    this.shades.items.brown.matcap = this.resources.items.matcapBrownTexture
    this.items.brown = this.shades.items.brown

    // Gray
    this.shades.items.gray = new MatcapMaterial()
    this.shades.items.gray.name = 'shadeGray'
    this.shades.items.gray.matcap = this.resources.items.matcapGrayTexture
    this.items.gray = this.shades.items.gray

    // Beige
    this.shades.items.beige = new MatcapMaterial()
    this.shades.items.beige.name = 'shadeBeige'
    this.shades.items.beige.matcap = this.resources.items.matcapBeigeTexture
    this.items.beige = this.shades.items.beige

    // Red
    this.shades.items.red = new MatcapMaterial()
    this.shades.items.red.name = 'shadeRed'
    this.shades.items.red.matcap = this.resources.items.matcapRedTexture
    this.items.red = this.shades.items.red

    // Black
    this.shades.items.black = new MatcapMaterial()
    this.shades.items.black.name = 'shadeBlack'
    this.shades.items.black.matcap = this.resources.items.matcapBlackTexture
    this.items.black = this.shades.items.black

    // Green emerald
    this.shades.items.emeraldGreen = new MatcapMaterial()
    this.shades.items.emeraldGreen.name = 'shadeEmeraldGreen'
    this.shades.items.emeraldGreen.matcap = this.resources.items.matcapEmeraldGreenTexture
    this.items.emeraldGreen = this.shades.items.emeraldGreen

    // Purple
    this.shades.items.purple = new MatcapMaterial()
    this.shades.items.purple.name = 'shadePurple'
    this.shades.items.purple.matcap = this.resources.items.matcapPurpleTexture
    this.items.purple = this.shades.items.purple

    // Blue
    this.shades.items.blue = new MatcapMaterial()
    this.shades.items.blue.name = 'shadeBlue'
    this.shades.items.blue.matcap = this.resources.items.matcapBlueTexture
    this.items.blue = this.shades.items.blue

    // Yellow
    this.shades.items.yellow = new MatcapMaterial()
    this.shades.items.yellow.name = 'shadeYellow'
    this.shades.items.yellow.matcap = this.resources.items.matcapYellowTexture
    this.items.yellow = this.shades.items.yellow

    // Bronze
    this.shades.items.bronze = new MatcapMaterial()
    this.shades.items.bronze.name = 'shadeBronze'
    this.shades.items.bronze.matcap = this.resources.items.matcapBronzeTexture
    this.items.bronze = this.shades.items.bronze

    // Gold
    this.shades.items.gold = new MatcapMaterial()
    this.shades.items.gold.name = 'shadeBronze'
    this.shades.items.gold.matcap = this.resources.items.matcapGoldTexture
    this.items.gold = this.shades.items.gold

    // Silver
    this.shades.items.silver = new MatcapMaterial()
    this.shades.items.silver.name = 'shadeSilver'
    this.shades.items.silver.matcap = this.resources.items.matcapSilverTexture
    this.items.silver = this.shades.items.silver

    // Debug
    if (this.debug) {
      const folder = this.debugFolder.addFolder('shades')

      folder
        .add(this.shades.uniforms, 'uIndirectDistanceAmplitude')
        .step(0.001)
        .min(0)
        .max(3)
        .onChange(this.shades.updateMaterials)
      folder
        .add(this.shades.uniforms, 'uIndirectDistanceStrength')
        .step(0.001)
        .min(0)
        .max(2)
        .onChange(this.shades.updateMaterials)
      folder
        .add(this.shades.uniforms, 'uIndirectDistancePower')
        .step(0.001)
        .min(0)
        .max(5)
        .onChange(this.shades.updateMaterials)
      folder
        .add(this.shades.uniforms, 'uIndirectAngleStrength')
        .step(0.001)
        .min(0)
        .max(2)
        .onChange(this.shades.updateMaterials)
      folder
        .add(this.shades.uniforms, 'uIndirectAngleOffset')
        .step(0.001)
        .min(-2)
        .max(2)
        .onChange(this.shades.updateMaterials)
      folder
        .add(this.shades.uniforms, 'uIndirectAnglePower')
        .step(0.001)
        .min(0)
        .max(5)
        .onChange(this.shades.updateMaterials)
      folder
        .addColor(this.shades, 'indirectColor')
        .onChange(this.shades.updateMaterials)
    }
  }

  setFloorShadow () {
    this.items.floorShadow = new FloorShadowMaterial()
    this.items.floorShadow.depthWrite = false
    this.items.floorShadow.shadowColor = '#e6987c'
    this.items.floorShadow.uniforms.uShadowColor.value = new THREE.Color(
      this.items.floorShadow.shadowColor
    )
    this.items.floorShadow.uniforms.uAlpha.value = 0

    this.items.floorShadow.updateMaterials = () => {
      this.items.floorShadow.uniforms.uShadowColor.value = new THREE.Color(
        this.items.floorShadow.shadowColor
      )
    }

    // Debug
    if (this.debug) {
      const folder = this.debugFolder.addFolder('floorShadow')

      folder
        .addColor(this.items.floorShadow, 'shadowColor')
        .onChange(this.items.floorShadow.updateMaterials)
    }
  }
}
