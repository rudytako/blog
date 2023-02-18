import * as type from "../types/categoryType";
import { ICategory } from "../../utils/TypeScript";

const categoryReducer = (state: ICategory[] = [], action: type.ICategoryType): ICategory[] => {
    switch (action.type) {
        case type.CREATE_CATEGORY:
            return [action.payload, ...state]
        case type.GET_CATEGORIES:
            return action.payload
        case type.UPDATE_CATEGORY:
            return state.map(item => (
                item._id === action.payload._id ? { ...item, name: action.payload.name } : item
            ))
        case type.DELETE_CATEGORY:
            return state.filter(item => item._id !== action.payload)
        default:
            return state
    }
}

export default categoryReducer