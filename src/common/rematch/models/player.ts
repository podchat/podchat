import { createModel } from '@rematch/core'
import { RootModel } from './index'

const initState = {
  playerVisible: false,
  showNowPlaying: false,
  playing: {
    ready: false,
    url: "",
    paused: false,
    title: "62. 你的电脑不是你的",
    channel: "内核恐慌",
    seekCurrent: 1762,
    seekTotal: 7130,
    seekLoaded: 6216,
    cover: "https://assets.fireside.fm/file/fireside-images/podcasts/images/b/bcdeb9eb-7a8c-4a76-a424-1023c5d280b0/cover_small.jpg?v=3"
  },
  ignoreProgress: false
}

export const player = createModel<RootModel>()({
  state: {
    ...initState
  },
  reducers: {
    playerVisibilityChange(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playerVisible: payload
      }
    },
    toggleNowPlaying(state: typeof initState, payload: boolean) {
      return {
        ...state,
        showNowPlaying: payload
      }
    },
    setReady(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playing: {
          ...state.playing,
          ready: payload
        }
      }
    },
    setDuration(state: typeof initState, payload: number) {
      return {
        ...state,
        playing: {
          ...state.playing,
          seekTotal: payload
        }
      }
    },
    setProgress(state: typeof initState, payload: { played: number, loaded: number }) {
      return {
        ...state,
        playing: {
          ...state.playing,
          seekLoaded: payload.loaded,
          seekCurrent: payload.played
        }
      }
    },
    setSeek(state: typeof initState, payload: number) {
      let target = state.playing.seekCurrent + payload
      if(target < 0) {
        target = 0
      }
      if(target > state.playing.seekTotal) {
        target = state.playing.seekTotal
      }
      seekTo_Debounced(target)
      return {
        ...state,
        playing: {
          ...state.playing,
          seekCurrent: target
        }
      }
    },
    setSeekTo(state: typeof initState, payload: number) {
      let target = payload
      if(target < 0) {
        target = 0
      }
      if(target > state.playing.seekTotal) {
        target = state.playing.seekTotal
      }
      seekTo_Debounced(target)
      return {
        ...state,
        playing: {
          ...state.playing,
          seekCurrent: target
        },
        ignoreProgress: true
      }
    },
    resetIgnorance(state: typeof initState) {
      return {
        ...state,
        ignoreProgress: false
      }
    },
    setUrl(state: typeof initState, payload: string) {
      return {
        ...state,
        playing: {
          ...state.playing,
          url: payload
        }
      }
    },
    setPaused(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playing: {
          ...state.playing,
          paused: payload
        }
      }
    }
  },
  effects: (dispatch: any) => ({
    async seek(change: number) {
      dispatch.player.setSeek(change)
    },
    async seekTo(target: number) {
      dispatch.player.setSeekTo(target)
    },
    async startPlaying(url: string) {
      await window.electron.invoke('player', {
        action: 'setParams',
        payload: {
          url: url,
          playing: true
        }
      })
      dispatch.player.setPaused(false)
      dispatch.player.setUrl(url)
    },
    async togglePause(paused: boolean) {
      await window.electron.invoke('player', {
        action: 'setParams',
        payload: {
          playing: !paused
        }
      })
      dispatch.player.setPaused(paused)
    }
  })
})

let timer_seekTo: NodeJS.Timeout | null = null
function seekTo_Debounced(timeBySec: number) {
  if(timer_seekTo !== null) {
    clearTimeout(timer_seekTo)
    timer_seekTo = null
  }
  timer_seekTo = setTimeout(() => {
    window.electron.invoke('player', {
      action: 'seekTo',
      payload: timeBySec
    })
  }, 100)
}