import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditCategory = () => {
    const {id} = useParams()
    const [category, setCategory] = useState("")
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    useEffect(()=> {
        axios.get('http://localhost:3000/auth/category/'+id)
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result[0].name)
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [id])

    const validateForm = () => {
        const newErrors = {}
        
        if (!category || category.trim() === "") {
            newErrors.category = "Danh mục không được để trống"
        }
        
        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validateForm()
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        
        setErrors({})
        axios.put('http://localhost:3000/auth/edit_category/'+id, {category})
        .then(result => {
            if(result.data.Status) {
                navigate('/dashboard/category')
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }
    
  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
        <div className='p-3 rounded w-25 border'>
            <h2>Edit Category</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="category"><strong>Category:</strong></label>
                    <input 
                        type="text" 
                        name='category' 
                        placeholder='Enter Category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} 
                        className={`form-control rounded-0 ${errors.category ? 'is-invalid' : ''}`}
                        id='category'
                    />
                    {errors.category && <div className="text-warning mt-1">{errors.category}</div>}
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'>Edit Category</button>
            </form>
        </div>
    </div>
  )
}

export default EditCategory
