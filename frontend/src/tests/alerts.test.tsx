import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, test } from 'vitest'
import { AlertData, AlertMenu } from '../components/alert'
import { useState } from 'react'
import { a } from 'vitest/dist/chunks/suite.qtkXWc6R.js'

const testAlert: AlertData = {
  key: 0,
  message: 'THIS IS NOT A DRILL',
  timestamp: Date.now(),
}

const testAlert2: AlertData = {
  key: 1,
  message: 'Relax, it\'s a drill',
  timestamp: Date.now(),
}

const alertsArray: AlertData[] = []

function setAlerts(data: AlertData) {
  alertsArray.push(data)
}

// const [alerts, setAlerts] = useState<AlertData[]>([]);

// const [defaultProps]: Parameters<typeof AlertMenu> = [{
//     alerts: [testAlert],
//     setAlerts: setAlerts
// }];

const AlertMenuWrapper = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([])

  function addAlert1() {
    setAlerts(a => [...a, testAlert])
  }

  function addAlert2() {
    setAlerts(a => [...a, testAlert2])
  }

  return (
    <>
      <AlertMenu alerts={alerts} setAlerts={setAlerts} />
      <button onClick={() => addAlert1()}>Add Alert</button>
      <button onClick={() => addAlert2()}>Add Alert 2</button>
    </>
  )
}

describe('Alert', () => {
  it('renders', () => {
    render(<AlertMenuWrapper />)
  })

  it('Multiple alerts', () => {
    render(<AlertMenuWrapper />)
    fireEvent.click(screen.getByText('Add Alert'))
    expect(screen.getByText('THIS IS NOT A DRILL')).toBeVisible()

    fireEvent.click(screen.getByText('Add Alert 2'))
    expect(screen.getByText('Relax, it\'s a drill')).toBeVisible()
  })
})
