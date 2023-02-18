import { IBlogsCategory, IGetBlogsCategoryType, GET_BLOGS_CATEGORY_ID } from '../types/blogtype';

const blogsCategoryReducer = (state: IBlogsCategory[] = [], action: IGetBlogsCategoryType): IBlogsCategory[] => {
    switch (action.type) {
        case GET_BLOGS_CATEGORY_ID:
            if (state.every(item => item.id !== action.payload.id)) {
                return [...state, action.payload]
            } else {
                return state.map(blog => (
                    blog.id === action.payload.id
                    ? action.payload
                    : blog
                ))
            }
        default:
            return state
    }
}

export default blogsCategoryReducer;