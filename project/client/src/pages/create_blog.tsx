import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootStore, IBlog } from '../utils/TypeScript'
import { validCreateBlog } from '../utils/Valid'
import store from '../redux/store'
import NotFound from '../components/global/NotFound'
import CreateForm from '../components/cards/CreateForm'
import CardHoriz from '../components/cards/CardHoriz'
import Quill from '../components/editor/ReactQuill'
import { ALERT } from '../redux/types/alertType'
import { createBlog, updateBlog } from '../redux/actions/blogAction'
import { getAPI } from '../utils/FetchData'

interface IProps {
  id?: string
}

const CreateBlog: React.FC<IProps> = ({id}) => {
  const initState = {
    user: '',
    title: '',
    content: '',
    description: '',
    thumbnail: '',
    category: '',
    createdAt: new Date().toISOString()
  }

  const [blog, setBlog] = useState<IBlog>(initState)
  const [body, setBody] = useState('')
  const [text, setText] = useState('')

  const { authReducer } = useSelector((state: RootStore) => state)

  type AppDispatch = typeof store.dispatch
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return

    getAPI(`blog/${id}`)
    .then(res => {
      setBlog(res.data)
      setBody(res.data.content)
    })
    .catch(err => console.log(err))

    return () => {
      setBlog(initState)
      setBody('')
    }
  }, [id])

  useEffect(() => {
    const div = divRef.current
    if (!div) return
    const text = (div?.innerText as string)
    setText(text)
  }, [body])

  const handleSubmit = async () => {
    if (!authReducer.access_token) return

    const check = validCreateBlog({...blog, content: text})
    if (check.errLength !== 0) return dispatch({type: ALERT, payload: {errors: check.errMsg}})

    let newData = {...blog, content: body}

    if (id) {
      dispatch(updateBlog(newData, authReducer.access_token))
    } else
      dispatch(createBlog(newData, authReducer.access_token))

  }

  if (!authReducer.access_token) return <NotFound/>
  return (
    <div className='my-4 create_blog'>
      <h2>Create Blog</h2>

      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Create</h5>
          <CreateForm blog={blog} setBlog={setBlog} />
        </div>
        <div className="col-md-6">
          <h5>Preview</h5>
          <CardHoriz blog={blog} />
        </div>
      </div>

      <Quill setBody={setBody} body={body} />

      <div ref={divRef} dangerouslySetInnerHTML={{__html: body}} style={{display: 'none'}} />
      <small>{text.length}</small>

      <button className='btn btn-dark mt-3 d-block mx-auto' onClick={handleSubmit}>
        { id ? 'Update Post' : 'Create Post' }
      </button>

    </div>
  )
}

export default CreateBlog