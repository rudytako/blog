import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IComment, RootStore } from '../../utils/TypeScript'
import store from '../../redux/store'
import Input from './Input'
import { replyComment, updateComment, deleteComment } from '../../redux/actions/commentAction'

interface IProps {
  children?: JSX.Element[]
  comment: IComment
  showReply: IComment[]
  setShowReply: (showReply: IComment[]) => void
}

const CommentList: React.FC<IProps> = ({ comment, showReply, setShowReply, children }) => {
  const [onReply, setOnReply] = useState(false)
  const { authReducer } = useSelector((state: RootStore) => state)

  const [edit, setEdit] = useState<IComment>()

  type AppDispatch = typeof store.dispatch
  const useAppDispatch: () => AppDispatch = useDispatch
  const dispatch = useAppDispatch()

  const handleReply = (body: string) => {
    if (!authReducer.user || !authReducer.access_token) return

    const data = {
      user: authReducer.user,
      blog_id: comment.blog_id,
      blog_user_id: comment.blog_user_id,
      content: body,
      replyCM: [],
      reply_user: comment.user,
      comment_root: comment.comment_root || comment._id,
      createdAt: new Date().toISOString()
    }

    setShowReply([data, ...showReply])
    dispatch(replyComment(data, authReducer.access_token))
    setOnReply(false)
  }

  const handleUpdate = (body: string) => {
    if (!authReducer.user || !authReducer.access_token || !edit) return

    if (body === comment.content) return setEdit(undefined)

    const newComment = {...edit, content: body}
    dispatch(updateComment(newComment, authReducer.access_token))

    setEdit(undefined)
  }

  const handleDelete = (comment: IComment) => {
    if (!authReducer.user || !authReducer.access_token) return
    dispatch(deleteComment(comment, authReducer.access_token))
  }

  const Nav = (comment: IComment) => {
    return (
      <div>
        <i className='fas fa-trash mx-2' onClick={() => handleDelete(comment)} />
        <i className='fas fa-edit me-2' onClick={() => setEdit(comment)} />
      </div>
    )
  }

  return (
    <div className='w-100'>
      {
        edit
        ? <Input callback={handleUpdate} edit={edit} setEdit={setEdit} />
        : <div className="comment-box">
            <div className='p-2' dangerouslySetInnerHTML={{ __html: comment.content }} />

            <div className="d-flex justify-content-between p-2">
              <small style={{ cursor: 'pointer' }} onClick={() => setOnReply(!onReply)} >
                {onReply
                  ? '- Cancel -'
                  : '- Reply -'}
              </small>

              <small className='d-flex'>
                <div className='comment-nav'>
                  {
                    comment.blog_user_id === authReducer.user?._id
                      ? comment.user._id === authReducer.user._id
                        ? Nav(comment)
                        : <i className='fas fa-trash ms-2' onClick={() => handleDelete(comment)} />
                      : comment.user._id === authReducer.user?._id && Nav(comment)
                  }
                </div>
                <div>
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              </small>
            </div>
          </div>
      }

      {
        onReply && <Input callback={handleReply} />
      }
      {children}

    </div>
  )
}

export default CommentList