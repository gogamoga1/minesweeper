import React, { useEffect, useState } from 'react'
import { autorun } from 'mobx'

import store from '../store/store'
import new_game_ico from '../smiley1.svg'
import in_progress_ico from '../smiley.svg'
import lost_ico from '../smiley3.svg'

const Reset: React.FC = () => {
  const [logo, setLogo] = useState<string>('')
  useEffect(() => {
    autorun(() => {
      switch (store.currentStatus) {
        case 'IN_PROGRESS':
          setLogo(in_progress_ico)
          break
        case 'GAME_OVER':
          setLogo(lost_ico)
          break
        case 'NEW_GAME':
        case 'GAME_RESET':
          setLogo(new_game_ico)
          break
      }
    })
  }, [])

  return (
    <div className='reset-btn'>
      <button className='reset-btn'>
        <img
          style={{ maxWidth: '100%', cursor: 'pointer' }}
          src={logo}
          alt='my image'
          onClick={() => store.setUpGameBoard()}
        />
      </button>
    </div>
  )
}

export default Reset
