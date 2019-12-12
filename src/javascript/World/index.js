import React from 'react'
import Tabernacle from './Tabernacle'
import Floor from './Floor'

const World = () => {
  return (
    <>
      <axesHelper />
      <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshNormalMaterial attach="material" />
      </mesh>
      <Tabernacle />
      <Floor />
    </>
  )
}

export default World
