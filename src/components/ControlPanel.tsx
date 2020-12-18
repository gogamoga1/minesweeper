import React from 'react'
import logo from '../bomb.svg'
import Reset from './Reset'
import FlagCounter from './Counter'
import Timer from './Timer'

const ControlPanel: React.FC = () => {
  return (
    <div className='control-panel'>
      <div className='name_logo'>
        <span className='logo-span'>Minesweeper</span>{' '}
        <img src={logo} className='App-logo' alt='logo' />
      </div>
      <div className='props'>
        <FlagCounter />
        <Reset />
        <Timer />
      </div>
    </div>
  )
}

export default ControlPanel
