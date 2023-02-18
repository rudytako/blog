import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { RootStore, IParams, IBlog } from '../../utils/TypeScript'
import store from '../../redux/store'
import { getBlogsByCategory } from '../../redux/actions/blogAction'
import Loading from '../../components/global/Loading'
import CardVert from '../../components/cards/CardVert'
import Pagination from '../../components/global/Pagination'

const BlogsByCategory = () => {
    const { categoryReducer, blogsCategoryReducer } = useSelector((state: RootStore) => state)
    type AppDispatch = typeof store.dispatch
    const useAppDispatch: () => AppDispatch = useDispatch
    const dispatch = useAppDispatch()

    const [categoryId, setCategoryId] = useState('')
    const [blogs, setBlogs] = useState<IBlog[]>()
    const [total, setTotal] = useState(0)

    const { slug }: IParams = useParams()
    const { search } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
     const category = categoryReducer.find(item => item.name === slug)
     if (category) setCategoryId(category._id)
    }, [slug, categoryReducer])

    useEffect(() => {
        if (!categoryId) return
        if (blogsCategoryReducer.every(item => item.id !== categoryId)) {
            dispatch(getBlogsByCategory(categoryId, search))
        } else {
            const data = blogsCategoryReducer.find(item => item.id === categoryId)
            if (!data) return
            setBlogs(data.blogs)
            setTotal(data.total)
            if (data.search) navigate(data.search)
        }
    }, [categoryId, blogsCategoryReducer, dispatch, search, navigate])

    const handlePagination = (num: number) => {
        const search = `?page=${num}`
        dispatch(getBlogsByCategory(categoryId, search))
    }

    if (!blogs) return <Loading/>
    return (
        <div className='blogs-category'>
            <div className="show-blogs">
                {
                    blogs.map(blog => (
                        <CardVert key={blog._id} blog={blog} />
                    ))
                }
            </div>
            {
                total > 1 &&
                <Pagination total={total} callback={handlePagination} />
            }
        </div>
    )
}

export default BlogsByCategory