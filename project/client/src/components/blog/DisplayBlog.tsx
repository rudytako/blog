import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IBlog, RootStore, IUser, IComment } from '../../utils/TypeScript'
import store from '../../redux/store'
import Comments from '../comments/Comments'
import Loading from '../alert/Loading'
import Input from '../comments/Input'
import { createComment, getComments } from '../../redux/actions/commentAction'
import Pagination from '../global/Pagination'

interface IProps {
    blog: IBlog
}

const DisplayBlog: React.FC<IProps> = ({blog}) => {
  const { authReducer, commentReducer } = useSelector((state: RootStore) => state)

  type AppDispatch = typeof store.dispatch
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  const [showComments, setShowComments] = useState<IComment[]>([])
  const [loading, setLoading] = useState(false)
  
  const { search } = useLocation()
  const navigate = useNavigate()

  const handleComment = (body: string) => {
    if (!authReducer.user || !authReducer.access_token) return

    const data = {
      content: body,
      user: authReducer.user,
      blog_id: (blog._id as string),
      blog_user_id: (blog.user as IUser)._id,
      replyCM: [],
      createdAt: new Date().toISOString()
    }

    setShowComments([data, ...showComments])
    dispatch(createComment(data, authReducer.access_token))
  }

  useEffect(() => {
    setShowComments(commentReducer.data)
  }, [commentReducer.data])

  const fetchComments = useCallback(async (id: string, num = 1) => {
    setLoading(true)
    await dispatch(getComments(id, num))
    setLoading(false)
  }, [dispatch])

  useEffect(() => {
    if (!blog._id) return
    const num = parseInt(search) || 1
    fetchComments(blog._id, num)
  }, [blog._id, fetchComments, useNavigate])

  const handlePagination = (num: number) => {
    if (!blog._id) return
    fetchComments(blog._id, num)
  }

  return (
    <div>
        <h2 className="text-center my-3 text-capitalize fs-1" style={{color: '#ff7a00'}} >
            {blog.title}
        </h2>

        <div className="text-end fst-italic" style={{color: 'teal'}} >
            <small>{ typeof(blog.user) !== 'string' && `By: ${blog.user.name}` }</small>
            <small className='ms-2'>{ new Date(blog.createdAt).toLocaleString() }</small>
        </div>

        <div dangerouslySetInnerHTML={{__html: blog.content}} />

        <hr className='my-1'/>
        <h3 style={{color: '#ff7a00'}} >Comments</h3>

        {
          authReducer.user 
          ? <Input callback={handleComment} />
          : <h5>Please <Link to={`/login?blog/${blog._id}`} >login</Link> to comment</h5>
        }

        {
          loading
          ? <Loading/>
          : showComments.map((comment, index) => (
            <Comments key={index} comment={comment} />
          ))
        }

        {
          commentReducer.total > 1 &&
          <Pagination total={commentReducer.total} callback={handlePagination} />
        }

    </div>
  )
}

export default DisplayBlog