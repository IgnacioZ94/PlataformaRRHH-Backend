import express from 'express'
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import sql from 'mssql';

const router = express.Router()

router.post("/employee_login", (req, res) => {
  const sqlQuery = "SELECT * from employee Where email = @email";

  pool.request()
      .input('email', sql.VarChar, req.body.email)
      .query(sqlQuery, (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" + err });
        if (result.recordset.length > 0) {
          bcrypt.compare(req.body.password, result[0].password, (err, response) => {
              if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
              if(response) {
                  const email = result[0].email;
                  const token = jwt.sign(
                      { role: "employee", email: email, id: result[0].id },
                      "jwt_secret_key",
                      { expiresIn: "1d" }
                  );
                  res.cookie('token', token)
                  return res.json({ loginStatus: true, id: result[0].id });
              }
          })

        } 
        else 
        {
            return res.json({ loginStatus: false, Error:"Credenciales incorrectas." });
        }
      });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({Status: true})
})

export {router as EmployeeRouter}
