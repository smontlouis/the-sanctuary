import React from 'react'
import Tabernacle from './Tabernacle'
import Floor from './Floor'
import useMatcaps from '../useMatcaps'

const World = () => {
  useMatcaps()
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
