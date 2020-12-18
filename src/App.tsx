import React from 'react'
import ControlPanel from './components/ControlPanel'
import Field from './components/Field'

const App: React.FC = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <div className='game'>
            <ControlPanel />
            <Field />
        </div>
      </header>
    </div>
  )
}

export default App
