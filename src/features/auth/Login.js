import { useRef, useState, useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()
    const [isRegistration, setIsRegistration] = useState(false);

    const dispatch = useDispatch()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [login, password, isRegistration])

    const  handleSubmit = async (e) => {
        e.preventDefault()

        try {
            let address

            if (isRegistration) {
                address = 'http://localhost:8080/api/users/register'
            } else {
                address = 'http://localhost:8080/api/users/authenticate'
            }
            const response = await fetch(address, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login: login, password: password }),
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            const userData = await response.json();
            dispatch(setCredentials({ ...userData, login }))
            //setLogin('')
            //setPassword('')
            navigate('/graph')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Register failed');
            }
        }
    }

    const handleUserInput = (e) => setLogin(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)

    const toggleMode = () => {
        setIsRegistration((prevMode) => !prevMode);
        setErrMsg(''); // Clear error message when switching modes
    };

    const content = (

        <section className="userLogin">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>{isRegistration ? 'User Registration' : 'User Login'}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    value={login}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={handlePwdInput}
                    value={password}
                    required
                />
                <button>{isRegistration ? 'Register' : 'Sign In'}</button>
            </form>

            <button onClick={toggleMode}>
                {isRegistration ? 'Switch to Login' : 'Switch to Registration'}
            </button>
        </section>
    )

    return content
}
export default Login