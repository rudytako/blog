import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootStore } from '../../utils/TypeScript'
import { useParams } from 'react-router-dom'
import { getAPI } from '../../utils/FetchData'
import { IParams, IBlog } from '../../utils/TypeScript'
import Loading from '../../components/global/Loading'
import { showErrMsg } from '../../components/alert/Alert'
import DisplayBlog from '../../components/blog/DisplayBlog'
import { socket } from '../../App'

const DetailBlog = () => {
    const { slug: id }: IParams = useParams()

    const [blog, setBlog] = useState<IBlog>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        setLoading(true)
        getAPI(`blog/${id}`)
            .then((res => {
                setBlog(res.data)
                setLoading(false)
            }))
            .catch(err => {
                setError(err.response.data.msg)
                setLoading(false)
            })

        return () => setBlog(undefined)
    }, [id])


    useEffect(() => {
        if (!id || !socket) return

        socket.emit('joinRoom', id)

        return () => { 
            socket.emit('outRoom', id)
        }
    }, [id])

    if (loading) return <Loading />
    return (
        <div className='my-4'>
            {error && showErrMsg(error)}
            {blog && <DisplayBlog blog={blog} />}
        </div>
    )
}

export default DetailBlog