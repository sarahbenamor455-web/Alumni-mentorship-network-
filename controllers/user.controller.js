const { generateToken } = require('../utils/generateToken')
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { isEduEmail } = require('../utils/emailValidator')

const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!isEduEmail(email)) {
            return res.status(400).json({ message: "A .edu email is required" })
        }

        const exists = await User.findOne({ where: { email: email.trim().toLowerCase() } })
        if (exists) {
            return res.status(409).json({ message: "Email already in use" })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstname,
            lastname,
            email: email.trim().toLowerCase(),
            password: hash,
            isVerified: true
        })

        return res.status(201).json({
            message: "Account created",
            user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role, isVerified: user.isVerified }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ where: { email: email.trim().toLowerCase() } })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = generateToken(user.id)

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role, isVerified: user.isVerified }
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {register,login }