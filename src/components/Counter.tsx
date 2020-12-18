import { observer } from 'mobx-react-lite'
import React from 'react'
import store from '../store/store'
const FlagCounter: React.FC = observer(() => {
  return (
    <div className='flag-counter'>
      <button>💣{store.minesCount}</button>
    </div>
  )
})

export default FlagCounter
