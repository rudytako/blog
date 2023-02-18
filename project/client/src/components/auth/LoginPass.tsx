import React, { useState } from 'react'
import { InputChange, FormSubmit } from '../../utils/TypeScript'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/actions/authAction'
import store from '../../redux/store'

const LoginPass = () => {
    const initialState = { account: '', password: '' }
    const [userLogin, setUserLogin] = useState(initialState)
    const { account, password } = userLogin

    const [typePass, setTypePass] = useState(false)

    type AppDispatch = typeof store.dispatch
    const useAppDispatch: () => AppDispatch = useDispatch
    const dispatch = useAppDispatch()

    const handleChangeInput = (e: InputChange) => {
        const { value, name } = e.target
        setUserLogin({...userLogin, [name]: value})
    }

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault();
        dispatch(login(userLogin))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label className='form-label' htmlFor='account'>Email / phone number</label>
                <input value={account} onChange={handleChangeInput} type="text" className="form-control" id='account' name='account' />
            </div>

            <div className="form-group mb-3">
                <label className='form-label' htmlFor='password'>Password</label>
                <div className="pass">
                    <input onChange={handleChangeInput} type={typePass ? 'text' : 'password'} className="form-control" id='password' name='password' />
                    <small onClick={() => setTypePass(!typePass)} >{typePass ? 'Hide' : 'Show'}</small>
                </div>
            </div>

            <button disabled={(account && password) ? false : true} type='submit' className='btn btn-dark w-100 mt-4'>Login</button>
        </form>
    )
}

export default LoginPass