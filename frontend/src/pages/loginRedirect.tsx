import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * This function navigates to login page
 * @returns
 */
export function LoginRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login')
  })

  return (<></>)
}
