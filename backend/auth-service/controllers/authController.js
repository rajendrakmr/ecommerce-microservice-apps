const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {

    const { name, email, password } = req.body

    const hashed = await bcrypt.hash(password, 10)

    const user = new User({
        name,
        email,
        password: hashed
    })

    await user.save()

    res.json({ message: "User registered" })
}

exports.login = async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ msg: "User not found" })

    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.status(401).json({ msg: "Invalid password" })

    const token = jwt.sign({ id: user._id }, "secret")

    res.json({ token })
}