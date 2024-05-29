import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({Status: true})
})

export {router as EmployeeRouter}
