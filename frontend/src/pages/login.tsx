import { useContext, useEffect, useState } from 'react'
import { ALERT_SUCCESS, fetchBackend } from '../helpers'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Button from '../components/buttons/button'
import TextInput from '../components/forms/textInput'
import { AlertContext } from '../App'

/**
 * This function displays the overall login screen, everything from the dashboard to email, name and password inputs
 */
export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const createAlert = useContext(AlertContext)

  // Scroll to top when screen first loaded
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // This function handles the login logic, checking for valid inputs
  async function login() {
    if (name === '') {
      createAlert('Name is empty!')
      return
    }
    if (email === '') {
      createAlert('Email is empty!')
      return
    }
    if (password === '') {
      createAlert('Password is empty!')
      return
    }

    const body = {
      email: email,
      password: password,
      name: name,
    }

    // If all inputs are valid, add token and email to local storage and navigate to dashboard
    const response = await fetchBackend('POST', '/admin/auth/login', body)
    if (response.error) {
      createAlert(response.error)
    }
    else {
      localStorage.setItem('token', response.token)
      localStorage.setItem('email', email)
      createAlert('Successfully logged in!', ALERT_SUCCESS)
      navigate('/dashboard')
    }
  }

  return (
    <>
      <Navbar>
        <Link to="/join">
          <Button text="Join a game" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white" />
        </Link>
        <Link to="/register">
          <Button text="Register" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white" />
        </Link>
        <Link to="/login">
          <Button text="Login" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white" />
        </Link>
      </Navbar>
      <main className="bg-white p-7 h-dvh absolute top-15 w-screen">
        <h1 className="text-4xl font-semibold pb-7">Login</h1>
        <form className="rounded-md bg-gray-100 p-4">
          <TextInput labelName="Name" id="login-name" type="text" onChange={e => setName(e.target.value)} onEnter={login} />
          <TextInput labelName="Email" id="login-email" type="email" onChange={e => setEmail(e.target.value)} onEnter={login} />
          <TextInput labelName="Password" id="login-password" type="password" onChange={e => setPassword(e.target.value)} onEnter={login} />
          <div className="pt-2">
            <Button text="Login" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" onClick={login} />
            <Link to="/register" className="underline ml-3 text-base">Register instead</Link>
          </div>
        </form>
      </main>
    </>
  )
}
