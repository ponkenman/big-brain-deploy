import { fireEvent, render, screen } from '@testing-library/react'
import { MediaType } from '../types'
import SelectMenu from '../components/forms/selectInput'
import { describe, expect, it } from 'vitest'

let number = 0
const [defaultProps]: Parameters<typeof SelectMenu> = [{
  labelName: 'SelectMenu',
  id: 'selectMenu',
  defaultValue: MediaType.NONE,
  options: Object.values(MediaType),
  onChange: () => number++,
}]

describe('SelectInput', () => {
  it('renders', () => {
    render(<SelectMenu {...defaultProps} />)
  })

  it('Fires onChange function when selecting MediaType.text', () => {
    render(<SelectMenu {...defaultProps} />)
    expect(screen.getByText('None')).toBeVisible()

    const input = screen.getByLabelText('SelectMenu') as HTMLInputElement

    fireEvent.change(input, {
      target: { value: MediaType.TEXT },
    })

    expect(screen.getByText('Text Stimulus')).toBeVisible()
    expect(number).to.be.eq(1)
  })
})
