import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddCategory = () => {
    const [category, setCategory] = useState("")
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

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
        axios.post('http://localhost:3000/auth/add_category', {category})
        .then(result => {
            if(result.data.Status) {
                navigate('/dashboard/category')
            } else {
                alert(result.data.Error)
            }
        })
        .catch(err => console.log(err))
    }
  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
        <div className='p-3 rounded w-25 border'>
            <h2>Add Category</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="category"><strong>Department:</strong></label>
                    <input 
                        type="text" 
                        name='category' 
                        placeholder='Enter Department'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} 
                        className={`form-control rounded-0 ${errors.category ? 'is-invalid' : ''}`}
                        id='category'
                    />
                    {errors.category && <div className="text-warning mt-1">{errors.category}</div>}
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'>Add Department</button>
            </form>
        </div>
    </div>
  )
}

export default AddCategory