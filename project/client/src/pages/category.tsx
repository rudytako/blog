import React, { useEffect, useState } from 'react'
import { FormSubmit, RootStore, ICategory } from '../utils/TypeScript'
import { useSelector, useDispatch } from 'react-redux'
import store from '../redux/store'
import NotFound from '../components/global/NotFound'
import { createCategory, updateCategory, deleteCategory } from '../redux/actions/categoryAction'

const Category = () => {
    const [name, setName] = useState('')
    const [edit, setEdit] = useState<ICategory | null>(null)

    const { authReducer, categoryReducer } = useSelector((state: RootStore) => state)
    type AppDispatch = typeof store.dispatch
    const useAppDispatch: () => AppDispatch = useDispatch
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (edit) setName(edit.name)
    }, [edit])

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault()
        if (!authReducer.access_token || !name) return

        if (edit) {
            if(edit.name === name) return;
            const data = {...edit, name}
            dispatch(updateCategory(data, authReducer.access_token))
        } else {
            dispatch(createCategory(name, authReducer.access_token))
        }
        setName('')
        setEdit(null)
    }

    const handleDelete = (id: string) => {
        if (!authReducer.access_token) return
        dispatch(deleteCategory(id, authReducer.access_token))
    }

    if (authReducer.user?.role !== 'admin') return <NotFound/>
    return (
        <div className='category'>
            <form onSubmit={handleSubmit}>
                <label htmlFor='category'>Category</label>

                <div className="d-flex align-items-center">
                    {
                        edit && <i style={{cursor: 'pointer'}} className="fas fa-times mx-2 text-danger" onClick={() => setEdit(null)}/>
                    }
                    <input type="text" name='category' id='category' value={name} onChange={e => setName(e.target.value)}/>

                    <button type='submit'>
                        {edit ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>

            <div>
                {
                    categoryReducer.map(category => (
                        <div className="category-row" key={category._id}>
                        <p className="m-0 text-capitalize">{category.name}</p>

                        <div>
                            <i className="fas fa-edit mx-2" onClick={() => setEdit(category)}/>
                            <i className="fas fa-trash-alt" onClick={() => handleDelete(category._id)}/>
                        </div>
                    </div>
                    ))
                } 
            </div>
        </div>
    )
}

export default Category