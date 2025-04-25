import { fireEvent, render, screen } from '@testing-library/react'
import TextInput from '../components/forms/textInput'
import { describe, expect, it } from 'vitest'

let number = 0
let number2 = 0
const [defaultProps]: Parameters<typeof TextInput> = [{
  labelName: 'TextInput',
  id: 'textInput',
  type: 'text',
  defaultValue: 'default text',
  onEnter: () => number++,
  onChange: () => number2++,
}]

describe('TextInput', () => {
  it('renders', () => {
    render(<TextInput {...defaultProps} />)
  })

  it('Fires onChange when user types', () => {
    render(<TextInput {...defaultProps} />)
    // expect(screen.getByText("default text")).toBeVisible();

    const textInput = screen.getByLabelText('TextInput') as HTMLInputElement

    fireEvent.change(textInput, {
      target: { value: 'hello world' },
    })

    expect(number2).to.be.eq(1)
    expect(screen.getByDisplayValue('hello world')).toBeInTheDocument()
  })

  it('Fires onEnter when user presses enter', () => {
    render(<TextInput {...defaultProps} />)
    // expect(screen.getByText("default text")).toBeVisible();

    const textInput = screen.getByLabelText('TextInput') as HTMLInputElement

    fireEvent.keyDown(textInput, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(number).to.be.eq(1)
  })
})
