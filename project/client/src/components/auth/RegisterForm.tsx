import React, { useState } from 'react'
import { InputChange, FormSubmit } from '../../utils/TypeScript'
import { useDispatch } from 'react-redux'
import { register } from '../../redux/actions/authAction'
import store from '../../redux/store'

const RegisterForm = () => {
    const initialState = { name: '', account: '', password: '', cf_password: '' }
    const [userRegister, setUserRegister] = useState(initialState)
    const { name, account, password, cf_password } = userRegister

    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    type AppDispatch = typeof store.dispatch

    const useAppDispatch: () => AppDispatch = useDispatch

    const dispatch = useAppDispatch()

    const handleChangeInput = (e: InputChange) => {
        const { value, name } = e.target
        setUserRegister({...userRegister, [name]: value})
    }

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault();
        dispatch(register(userRegister))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label className='form-label' htmlFor='name'>Name</label>
                <input value={name} onChange={handleChangeInput} placeholder='Name must be up to 20 characters' type="text" className="form-control" id='name' name='name' />
            </div>

            <div className="form-group mb-3">
                <label className='form-label' htmlFor='account'>Email / phone number</label>
                <input value={account}  onChange={handleChangeInput} placeholder='Your Email or phone number' type="text" className="form-control" id='account' name='account' />
            </div>

            <div className="form-group mb-3">
                <label className='form-label' htmlFor='password'>Password</label>
                <div className="pass">
                    <input onChange={handleChangeInput} type={typePass ? 'text' : 'password'} placeholder='Password must be at least 6 characters' className="form-control" id='password' name='password' />
                    <small onClick={() => setTypePass(!typePass)} >{typePass ? 'Hide' : 'Show'}</small>
                </div>
            </div>

            <div className="form-group mb-3">
                <label className='form-label' htmlFor='password'>Confirm Password</label>
                <div className="pass">
                    <input value={cf_password} onChange={handleChangeInput} type={typeCfPass ? 'text' : 'password'} placeholder='Confirm your password' className="form-control" id='cf_password' name='cf_password' />
                    <small onClick={() => setTypeCfPass(!typeCfPass)} >{typeCfPass ? 'Hide' : 'Show'}</small>
                </div>
            </div>

            <button type='submit' className='btn btn-dark w-100 my-1'>Register</button>
        </form>
    )
}

export default RegisterForm