import express from "express";
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";

const router = express.Router();

import sql from 'mssql';

router.post("/adminlogin", (req, res) => {
    const sqlQuery = "SELECT * from admin Where email = @email and password = @password";
    
    pool.request()
        .input('email', sql.VarChar, req.body.email)
        .input('password', sql.VarChar, req.body.password)
        .query(sqlQuery, (err, result) => {
            if (err) return res.json({ loginStatus: false, Error: "Query error" + err });
            if (result.recordset.length > 0) {
                const email = result.recordset[0].email;
                const token = jwt.sign(
                    { role: "admin", email: email, id: result.recordset[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie("token", token);
                return res.json({ loginStatus: true });
            } else {
                return res.json({ loginStatus: false, Error: "Credenciales incorrectas." });
            }
        });
});

router.get('/category', (req, res) => {
    const sqlQuery = "SELECT * FROM category";

    pool.request()
        .query(sqlQuery, (err, result) => {
            if (err) return res.json({Status: false, Error: "Query Error" + err});
            return res.json({Status: true, Result: result.recordset});
        });
});

router.post('/add_category', (req, res) => {
    const sqlQuery = "INSERT INTO category (name) VALUES (@category)";

    pool.request()
        .input('category', sql.VarChar, req.body.category)
        .query(sqlQuery, (err, result) => {
            if (err) return res.json({Status: false, Error: "Query Error" + err});
            return res.json({Status: true});
        });
});

// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee', upload.single('image'), (req, res) => {
    const sqlQuery = "INSERT INTO employee (name, email, password, address, salary, image, category_id) VALUES (@name, @email, @password, @address, @salary, @image, @category_id)";

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.json({Status: false, Error: "Query Error" + err});

        pool.request()
            .input('name', sql.VarChar, req.body.name)
            .input('email', sql.VarChar, req.body.email)
            .input('password', sql.VarChar, hash)
            .input('address', sql.VarChar, req.body.address)
            .input('salary', sql.Decimal, req.body.salary)
            .input('image', sql.VarChar, req.file.filename)
            .input('category_id', sql.Int, req.body.category_id)
            .query(sqlQuery, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.json({Status: false, Error: err});
                }
                return res.json({Status: true});
            });
    });
});

router.get('/employee', (req, res) => {
    const sqlQuery = "SELECT * FROM employee";

    pool.request()
        .query(sqlQuery, (err, result) => {
            if (err) return res.json({Status: false, Error: "Query Error" + err});
            return res.json({Status: true, Result: result.recordset});
        });
});

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sqlQuery = "SELECT * FROM employee WHERE id = @id";
    
    pool.request()
        .input('id', sql.Int, id)
        .query(sqlQuery, (err, result) => {
            if(err) return res.json({Status: false, Error: "Query Error: " + err})
            return res.json({Status: true, Result: result.recordset})
        });
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sqlQuery = `UPDATE employee 
        SET name = @name, email = @email, salary = @salary, address = @address, category_id = @category_id
        WHERE id = @id`;
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id,
        id
    ];
    
    pool.request()
        .input('name', sql.VarChar, values[0])
        .input('email', sql.VarChar, values[1])
        .input('salary', sql.Decimal, values[2])
        .input('address', sql.VarChar, values[3])
        .input('category_id', sql.Int, values[4])
        .input('id', sql.Int, values[5])
        .query(sqlQuery, (err, result) => {
            if(err) return res.json({Status: false, Error: "Query Error: " + err})
            return res.json({Status: true, Result: result})
        });
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sqlQuery = "DELETE FROM employee WHERE id = @id";
    
    pool.request()
        .input('id', sql.Int, id)
        .query(sqlQuery, (err, result) => {
            if(err) return res.json({Status: false, Error: "Query Error: " + err})
            return res.json({Status: true, Result: result})
        });
})

router.get('/admin_count', (req, res) => {
    const sqlQuery = "SELECT COUNT(id) AS admin FROM admin";

    pool.request()
        .query(sqlQuery, (err, result) => {
            if(err) return res.json({Status: false, Error: "Query Error: " + err})
            return res.json({Status: true, Result: result.recordset})
        });
})

router.get('/employee_count', (req, res) => {
    const sqlQuery = "SELECT COUNT(id) AS employee FROM employee";

    pool.request()
        .query(sqlQuery, (err, result) => {
            if(err) return res.json({Status: false, Error: "Query Error: " + err})
            return res.json({Status: true, Result: result.recordset})
        });
})

router.get('/salary_count', (req, res) => {
    const sqlQuery = "SELECT SUM(salary) AS salaryOFEmp FROM employee";

    pool.request()
        .query(sqlQuery, (err, result) => {
            if(err) return res.json({Status: false, Error: "Query Error: " + err})
            return res.json({Status: true, Result: result.recordset})
        });
})

router.get('/admin_records', (req, res) => {
    const sqlQuery = "SELECT * FROM admin";

    pool.request()
        .query(sqlQuery, (err, result) => {
            if(err) return res.json({Status: false, Error: "Query Error: " + err})
            return res.json({Status: true, Result: result.recordset})
        });
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export { router as adminRouter };