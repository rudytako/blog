import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore, InputChange, IUserInfo, FormSubmit } from '../../utils/TypeScript'
import store from '../../redux/store'
import NotFound from '../global/NotFound'
import { updateUser, resetPassword } from '../../redux/actions/userAction'

const UserInfo = () => {
  const initState = {
    name: '', account: '', avatar: '', password: '', cf_password: ''
  }

  const { authReducer } = useSelector((state: RootStore) => state)
  type AppDispatch = typeof store.dispatch
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  const [user, setUser] = useState<IUserInfo>(initState)
  const [typePass, setTypePass] = useState(false)
  const [typeCfPass, setTypeCfPass] = useState(false)

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target
    setUser({...user, [name]: value})
  }

  const handleChangeFile = (e: InputChange) => {
    const target = e.target as HTMLInputElement
    const files = target.files

    if(files){
      const file = files[0]
      setUser({...user, avatar: file})
    }
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    if (avatar || name) 
      dispatch(updateUser((avatar as File), name, authReducer))

    if (password && authReducer.access_token)
      dispatch(resetPassword(password, cf_password, authReducer.access_token))
  }

  const { name, account, avatar, password, cf_password } = user

  if (!authReducer.user) return <NotFound/>
  return (
    <form className='profile-info' onSubmit={handleSubmit}>
      <div className='info-avatar'>
        <img src={authReducer.user.avatar} alt='avatar' />

        <span>
          <i className='fas fa-camera' />
          <p>Change</p>
          <input type='file' accept='image/*' name='file' id='file-up' onChange={handleChangeFile}/>
        </span>
      </div>

      <div className="form-group my-3">
        <label htmlFor="name">Account</label>
        <input type="text" className='form-control' id='name' name='name' 
          defaultValue={authReducer.user.name} 
          onChange={handleChangeInput}
        />
      </div>

      <div className="form-group my-3">
        <label htmlFor="account">Account</label>
        <input type="text" className='form-control' id='account' name='account' 
          defaultValue={authReducer.user.account} 
          onChange={handleChangeInput} disabled={true}
        />
      </div>

      <div className="fprm-group my-3">
        <label htmlFor="password">Password</label>

        <div className='pass'>
          <input type={typePass ? 'text' : 'password'} className='form-control' id='password' name='password' 
            value={password}
            onChange={handleChangeInput}
            disabled={authReducer.user.type !== 'register'}
          />
          <small onClick={() => setTypePass(!typePass)}>{typePass ? 'Hide' : 'Show'}</small>
        </div>
      </div>

      {
        authReducer.user.type !== 'register' &&
        <small className='text-danger'>
          * Quick login with {authReducer.user.type} can't use password reset *
        </small>
      }

      <div className="form-group my-3">
        <label htmlFor="cf_password">Confirm Password</label>

        <div className='pass'>
          <input type={typeCfPass ? 'text' : 'password'} className='form-control' id='cf_password' name='cf_password' 
            value={cf_password}
            onChange={handleChangeInput}
            disabled={authReducer.user.type !== 'register'}
          />
          <small onClick={() => setTypeCfPass(!typeCfPass)}>{typeCfPass ? 'Hide' : 'Show'}</small>
        </div>
      </div>

      <button className='btn btn-dark w-100' type='submit'>Update</button>
    </form>
  )
}

export default UserInfo