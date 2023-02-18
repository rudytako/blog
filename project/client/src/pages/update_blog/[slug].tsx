import React from 'react'
import { useParams } from 'react-router-dom'
import { IParams } from '../../utils/TypeScript'
import CreateBlog from '../create_blog'

const UpdateBlog = () => {
    const { slug }:IParams = useParams()

    return <CreateBlog id={slug} />
}

export default UpdateBlog