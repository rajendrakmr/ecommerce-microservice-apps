const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const errors = {}

    if (!name || name.trim() === '') {
      errors.name = 'Name is required'
    }

    if (!email) {
      errors.email = 'Email is required'
    }

    if (!password) {
      errors.password = 'Password is required'
    }

    if (password && password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors })
    }

    const existUser = await User.findOne({ email })

    if (existUser) {
      return res.status(422).json({
        errors: { email: 'Email already exists' }
      })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashed
    })

    await user.save()

    res.json({
      message: 'User registered successfully'
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const errors = {}

    if (!email) {
      errors.email = 'Email is required'
    }

    if (!password) {
      errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(422).json({
        errors: { email: 'User not found' }
      })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(422).json({
        errors: { password: 'Invalid password' }
      })
    }

    const token = jwt.sign(
      { id: user._id },
      'secret',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    })
  }
}