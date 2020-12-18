import { observer } from 'mobx-react-lite'
import { autorun } from 'mobx'

import React, { useState, useEffect } from 'react'
import store from '../store/store'

const Timer: React.FC = observer(() => {
  const [timer, setTimer] = useState<number>(0)

  useEffect(() => {
    let time = 0
    autorun(() => {
      switch (store.currentStatus) {
        case 'IN_PROGRESS':
          time = window.setInterval(() => setTimer((prev) => (prev += 1)), 1000)
          break
        case 'GAME_OVER':
          window.clearInterval(time)
          break
        case 'GAME_RESET':
          window.clearInterval(time)
          setTimer(0)
          break
        case 'GAME_WON':
          console.log('WON!')
      }
      return () => {
        window.clearInterval(time)
      }
    })
  }, [])

  function displayTime(): string {
    return timer > 59
      ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' + (timer % 60) : timer % 60}`
      : timer < 10
      ? '0:0' + timer
      : '0:' + timer
  }

  return <div className='timer'>{displayTime()}</div>
})

export default Timer
