import { Dispatch } from "redux";
import { ALERT, IAlertType } from "../types/alertType";
import { 
    ICreateCommentType, 
    GET_COMMENTS, 
    IGetCommentsType, 
    IReplyCommentType, 
    UPDATE_COMMENT, 
    IUpdateCommentType, 
    UPDATE_REPLY,
    DELETE_COMMENT,
    DELETE_REPLY,
    IDeleteCommentType 
} from "../types/commentType";
import { IComment } from "../../utils/TypeScript";
import { getAPI, postAPI, patchAPI, deleteAPI } from "../../utils/FetchData";

export const createComment = (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | ICreateCommentType>) => {
    try {
        const res = await postAPI('comment', data, token)
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
    }
}

export const getComments = (id: string, num: number) => async (dispatch: Dispatch<IAlertType | IGetCommentsType>) => {
    try {
        let limit = 4
        const res = await getAPI(`comment/blog/${id}?page=${num}&limit=${limit}`)

        dispatch({
            type: GET_COMMENTS,
            payload: {
                data: res.data.comments,
                total: res.data.total
            }
        })
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
    }
}

export const replyComment = (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | IReplyCommentType>) => {
    try {
        const res = await postAPI('reply_comment', data, token)
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
    }
}

export const updateComment = (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | IUpdateCommentType>) => {
    try {
        dispatch({
            type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENT,
            payload: data
        })

        const res = await patchAPI(`comment/${data._id}`, { data }, token)
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
    }
}

export const deleteComment = (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | IDeleteCommentType>) => {
    try {
        dispatch({
            type: data.comment_root ? DELETE_REPLY : DELETE_COMMENT,
            payload: data
        })

        await deleteAPI(`comment/${data._id}`, token)
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
    }
}