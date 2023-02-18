import React, { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store from '../../redux/store'
import { getOtherInfo } from '../../redux/actions/userAction'
import { RootStore, IUser } from '../../utils/TypeScript'
import Loading from '../global/Loading'

interface IProps {
  id: string
}

const OtherInfo: React.FC<IProps> = ({ id }) => {
  const [other, setOther] = useState<IUser>()
  const { otherInfoReducer } = useSelector((state: RootStore) => state)

  type AppDispatch = typeof store.dispatch
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  useEffect(() =>{
    if(!id) return

    if (otherInfoReducer.every(user => user._id !== id)) {
      dispatch(getOtherInfo(id))
    } else {
      const newUser = otherInfoReducer.find(user => user._id === id)
      if (newUser) setOther(newUser)
    }
  }, [id, otherInfoReducer, dispatch])


  if (!other) return <Loading/>
  return (
    <div className='profile-info text-center rounded'>
      <div className="info-avatar">
        <img src={other.avatar} alt='avatar' ></img>
      </div>

      <h5 className='text-uppercase text-danger'>{other.role}</h5>

    <div>
      Name: <span className='text-info'>{other.name}</span>
    </div>

    <div>Email / Phone Number</div>
    <span className='text-info'>{other.account}</span>

    <div>
      Join Date: <span style={{color: 'ffc107'}}>{new Date(other.createdAt).toLocaleString()}</span>
    </div>
    </div>
  )
}

export default OtherInfo