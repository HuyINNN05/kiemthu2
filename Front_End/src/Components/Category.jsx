import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Category = () => {

    const [category, setCategory] = useState([])

    useEffect(()=> {
        loadCategory()
    }, [])

    const loadCategory = () => {
        axios.get('http://localhost:3000/auth/category')
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        if(window.confirm("Bạn có chắc muốn xoá danh mục này?")) {
            axios.delete('http://localhost:3000/auth/delete_category/'+id)
            .then(result => {
                if(result.data.Status) {
                    loadCategory()
                } else {
                    alert(result.data.Error)
                }
            }).catch(err => console.log(err))
        }
    }

  return (
    <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'>
            <h3>Category List</h3>
        </div>
        <Link to="/dashboard/add_category" className='btn btn-success'>Add Category</Link>
        <div className='mt-3'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        category.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>
                                    <Link to={"/dashboard/edit_category/"+c.id} className='btn btn-info btn-sm me-2'>
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(c.id)} 
                                        className='btn btn-danger btn-sm'
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Category