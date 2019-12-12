import create from 'zustand'
import { devtools } from 'zustand/middleware'
import produce from 'immer'

const immer = config => (set, get, api) => config(fn => set(produce(fn)), get, api)

const [useStore] = create(
  immer(
    devtools(
      set => ({
        count: 1,
        matcaps: {},
        setMatcaps: m =>
          set(s => {
            s.matcaps = m
          }, 'setMatcaps')
      }),
      'Default'
    )
  )
)

export default useStore
