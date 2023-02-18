import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { IParams, RootStore, IBlog } from '../../utils/TypeScript'
import store from '../../redux/store'
import { getBlogsByUserId } from '../../redux/actions/blogAction'
import Loading from '../global/Loading'
import CardHoriz from '../cards/CardHoriz'
import Pagination from '../global/Pagination'

const UserBlogs = () => {
  const { slug: user_id }: IParams = useParams()
  const { blogsUserReducer } = useSelector((state: RootStore) => state)

  const [blogs, setBlogs] = useState<IBlog[]>()
  const [total, setTotal] = useState(0)

  const { search } = useLocation()
  const navigate = useNavigate()

  type AppDispatch = typeof store.dispatch
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!user_id) return

    if(blogsUserReducer.every(item => item.id !== user_id)) {
      dispatch(getBlogsByUserId(user_id, search))
    } else {
      const data = blogsUserReducer.find(item => item.id === user_id)
      if (!data) return

      setBlogs(data.blogs)
      setTotal(data.total)
      if(data.search) navigate(data.search)
    }
  }, [user_id, blogsUserReducer, dispatch, search, useLocation])
  
  const handlePagination = (num: number) => {
    const search = `?page=${num}`
    dispatch(getBlogsByUserId(user_id, search))
  }

  if (!blogs) return <Loading/>
  if (blogs.length === 0) return (
    <h3 className='text-center'>No Blogs</h3>
  )

  return (
    <div>
      <div>
        {
          blogs.map(blog => (
            <CardHoriz key={blog._id} blog={blog} />
          ))
        }
      </div>

      <div>
        <Pagination total={total} callback={handlePagination} />
      </div>
    </div>
  )
}

export default UserBlogs