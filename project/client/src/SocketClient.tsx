import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootStore, IComment } from './utils/TypeScript'
import { socket } from './App'
import store from './redux/store'
import { CREATE_COMMENT, DELETE_COMMENT, DELETE_REPLY, REPLY_COMMENT, UPDATE_COMMENT, UPDATE_REPLY } from './redux/types/commentType'

const SocketClient = () => {
    type AppDispatch = typeof store.dispatch
    const useAppDispatch: () => AppDispatch = useDispatch
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!socket) return

        socket.on('createComment', (data: IComment) => {
            dispatch({ type: CREATE_COMMENT, payload: data })
        })

        return () => { socket.off('createComment') }
    }, [socket, dispatch])

    useEffect(() => {
        if (!socket) return

        socket.on('replyComment', (data: IComment) => {
            dispatch({ type: REPLY_COMMENT, payload: data })
        })

        return () => { socket.off('replyComment') }
    }, [socket, dispatch])

    useEffect(() => {
        if (!socket) return

        socket.on('updateComment', (data: IComment) => {
            dispatch({
                type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENT,
                payload: data
            })
        })

        return () => { socket.off('updateComment') }
    }, [socket, dispatch])

    useEffect(() => {
        if (!socket) return

        socket.on('deleteComment', (data: IComment) => {
            dispatch({
                type: data.comment_root ? DELETE_REPLY : DELETE_COMMENT,
                payload: data
            })
        })

        return () => { socket.off('deleteComment') }
    }, [socket, dispatch])

    return (
        <div>

        </div>
    )
}

export default SocketClient