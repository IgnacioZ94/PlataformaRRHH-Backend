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
                return res.json({ loginStatus: false, Error: "wrong email or password" });
            }
        });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export { router as adminRouter };