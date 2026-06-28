import mysql from 'mysql';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
});

con.connect(function(err) {
    if(err) {
        console.log("Lỗi kết nối:", err);
        process.exit(1);
    } else {
        console.log("✓ Kết nối thành công tới MySQL");
        
        // Tạo database
        con.query("CREATE DATABASE IF NOT EXISTS employeems", (err, result) => {
            if(err) {
                console.log("Lỗi tạo database:", err);
                process.exit(1);
            } else {
                console.log("✓ Database 'employeems' đã sẵn sàng");
            }
            
            // Chuyển sang database
            con.query("USE employeems", (err) => {
                if(err) {
                    console.log("Lỗi:", err);
                    process.exit(1);
                }
                
                // Tạo bảng admin
                const adminTable = `
                    CREATE TABLE IF NOT EXISTS admin (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        email VARCHAR(100) UNIQUE,
                        password VARCHAR(100)
                    )`;
                
                con.query(adminTable, (err) => {
                    if(err) {
                        console.log("Lỗi tạo bảng admin:", err);
                    } else {
                        console.log("✓ Bảng 'admin' đã sẵn sàng");
                        
                        // Thêm admin mặc định nếu chưa có
                        con.query("SELECT * FROM admin WHERE email = ?", ["admin@example.com"], (err, result) => {
                            if(result && result.length === 0) {
                                con.query("INSERT INTO admin (email, password) VALUES (?, ?)", ["admin@example.com", "admin123"], (err) => {
                                    if(!err) console.log("✓ Admin mặc định đã thêm (email: admin@example.com, password: admin123)");
                                });
                            }
                        });
                    }
                });
                
                // Tạo bảng category
                const categoryTable = `
                    CREATE TABLE IF NOT EXISTS category (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100)
                    )`;
                
                con.query(categoryTable, (err) => {
                    if(err) {
                        console.log("Lỗi tạo bảng category:", err);
                    } else {
                        console.log("✓ Bảng 'category' đã sẵn sàng");
                    }
                });
                
                // Tạo bảng employee
                const employeeTable = `
                    CREATE TABLE IF NOT EXISTS employee (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100),
                        email VARCHAR(100),
                        password VARCHAR(100),
                        address VARCHAR(100),
                        salary INT,
                        image VARCHAR(100),
                        category_id INT
                    )`;
                
                con.query(employeeTable, (err) => {
                    if(err) {
                        console.log("Lỗi tạo bảng employee:", err);
                    } else {
                        console.log("✓ Bảng 'employee' đã sẵn sàng");
                    }
                });
                
                setTimeout(() => {
                    con.end();
                    console.log("\n✓ Database đã được khởi tạo thành công!");
                    process.exit(0);
                }, 1000);
            });
        });
    }
});
