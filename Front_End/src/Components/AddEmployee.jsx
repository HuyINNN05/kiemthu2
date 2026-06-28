import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category_id: "",
    image: "",
  });
  const [category, setCategory] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate name
    if (!employee.name || employee.name.trim() === "") {
      newErrors.name = "Name không được để trống";
    }

    // Validate email
    if (!employee.email || employee.email.trim() === "") {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Validate password
    if (!employee.password || employee.password.trim() === "") {
      newErrors.password = "Password không được để trống";
    }

    // Validate salary
    if (!employee.salary || employee.salary.trim() === "") {
      newErrors.salary = "Salary không được để trống";
    } else if (isNaN(employee.salary) || parseFloat(employee.salary) <= 0) {
      newErrors.salary = "Salary phải là số dương";
    }

    // Validate address
    if (!employee.address || employee.address.trim() === "") {
      newErrors.address = "Address không được để trống";
    }

    // Validate category
    if (!employee.category_id || employee.category_id === "") {
      newErrors.category_id = "Category không được để trống";
    }

    // Validate image
    if (!employee.image) {
      newErrors.image = "Image không được để trống";
    }

    // Nếu có lỗi, hiển thị và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Nếu không có lỗi, xóa error state
    setErrors({});

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('password', employee.password);
    formData.append('address', employee.address);
    formData.append('salary', employee.salary);
    formData.append('image', employee.image);
    formData.append('category_id', employee.category_id);

    axios.post('http://localhost:3000/auth/add_employee', formData)
    .then(result => {
        if(result.data.Status) {
            navigate('/dashboard/employee')
        } else {
            alert(result.data.Error)
        }
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label for="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
            {errors.name && <span className="text-warning">{errors.name}</span>}
          </div>
          <div className="col-12">
            <label for="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
            {errors.email && <span className="text-warning">{errors.email}</span>}
          </div>
          <div className="col-12">
            <label for="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
            {errors.password && <span className="text-warning">{errors.password}</span>}
            <label for="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
            {errors.salary && <span className="text-warning">{errors.salary}</span>}
          </div>
          <div className="col-12">
            <label for="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
            {errors.address && <span className="text-warning">{errors.address}</span>}
          </div>
          <div className="col-12">
            <label for="category" className="form-label">
              Category
            </label>
            <select name="category" id="category" className="form-select"
                onChange={(e) => setEmployee({...employee, category_id: e.target.value})}>
              <option value="">-- Select Category --</option>
              {category.map((c) => {
                return <option value={c.id}>{c.name}</option>;
              })}
            </select>
            {errors.category_id && <span className="text-warning">{errors.category_id}</span>}
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" for="inputGroupFile01">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) => setEmployee({...employee, image: e.target.files[0]})}
            />
            {errors.image && <span className="text-warning">{errors.image}</span>}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
