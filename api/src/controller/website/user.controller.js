// Dependencies and models
const userModel = require('../../modles/user')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.secret_key || '1234567890'
const nodemailer = require('nodemailer')
const crypto = require('crypto')

// Register new user (website)
// Input: { email, password, ... }
// Output: created user and JWT token
exports.register = async (req, res) => {
  try {
  // Extract email and password from request body
  const { email, password } = req.body || {}
  if (!email) return res.send({ _status: false, _message: 'Email is required' })
  if (!password) return res.send({ _status: false, _message: 'Password is required' })

  // Check if user already exists with this email
  const existing = await userModel.findOne({ email, role_type: 'user', deleted_at: null })
  if (existing) return res.send({ _status: false, _message: 'Email already exists' })

  // Prepare user data and hash the password using bcrypt
  const saveData = { ...req.body }
  saveData.password = await bcrypt.hash(password, saltRounds)
  saveData.role_type = 'user'

  // Save new user to database
  // Save new user to database
  const created = await userModel(saveData).save()
  // Generate JWT token with user data
  const token = jwt.sign({ userData: created }, JWT_SECRET)
  return res.send({ _status: true, _token: token, _message: 'Account created successfully.', _data: created })
  } catch (err) {
  const errorMessages = {}
  if (err.errors) for (let k in err.errors) errorMessages[k] = err.errors[k].message
  return res.send({ _status: false, _message: 'Something went wrong.', _error: Object.keys(errorMessages).length ? errorMessages : err.message })
  }
}

// Login user (website)
// Input: { email, password }
// Output: JWT token and user data
exports.login = async (req, res) => {
  try {
  // Extract email and password from request body
  const { email, password } = req.body || {}
  if (!email || !password) return res.send({ _status: false, _message: 'Email and password are required' })

  // Find user by email
  const user = await userModel.findOne({ email, role_type: 'user', deleted_at: null })
  if (!user) return res.send({ _status: false, _message: "Email doesn't exist" })

  // Compare provided password with hashed password in database
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.send({ _status: false, _message: 'Password is incorrect' })
  // Check if account is active
  if (!user.status) return res.send({ _status: false, _message: 'Account is deactivated please contact support' })

  // Generate JWT token for authenticated user
  const token = jwt.sign({ userData: user }, JWT_SECRET)
  return res.send({ _status: true, _token: token, _message: 'Login successfully.', _data: user })
  } catch (err) {
  return res.send({ _status: false, _message: 'Something went wrong' })
  }
}

// View user profile
// Requires Authorization header with Bearer token
exports.viewProfile = async (req, res) => {
  try {
  // Extract authorization header containing Bearer token
  const auth = req.headers.authorization
  if (!auth) return res.send({ _status: false, _message: 'Authorization header is required' })
  // Extract token from "Bearer <token>" format
  const token = auth.split(' ')[1]
  // Verify token signature and extract user data
  const verifyToken = jwt.verify(token, JWT_SECRET)
  // Fetch user from database using user ID from token
  const user = await userModel.findOne({ _id: verifyToken.userData._id })
  return res.send({ _status: true, _message: 'Profile fetched', _data: user })
  } catch (err) {
  return res.send({ _status: false, _message: 'Something went wrong' })
  }
}

// Update user profile (name, email, mobile, image, etc.)
// Requires Authorization header with Bearer token
exports.updateProfile = async (req, res) => {
  try {
  // Extract and verify authorization token
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ _status: false, _message: 'Authorization header is required' })
  const token = auth.split(' ')[1]
  const verifyToken = jwt.verify(token, JWT_SECRET)
  // Fetch authenticated user
  const user = await userModel.findOne({ _id: verifyToken.userData._id, role_type: 'user', deleted_at: null })
  if (!user) return res.status(404).json({ _status: false, _message: 'User not found' })

  // Update user fields if provided in request body
  if (req.body?.email) user.email = req.body.email
  if (req.body?.name) user.name = req.body.name
  if (req.body?.mobile_number) user.mobile_number = req.body.mobile_number
  if (req.body?.Gender) user.Gender = req.body.Gender
  if (req.body?.Address) user.Address = req.body.Address
  // Update image if file uploaded
  if (req.file) user.image = req.file.filename
  user.updated_at = new Date()
  // Save updated user to database
  const updated = await user.save()
  return res.send({ _status: true, _message: 'Profile updated successfully', _data: updated })
  } catch (err) {
  return res.status(500).json({ _status: false, _message: 'Something went wrong', _error: err.message })
  }
}

// Change password for authenticated user
// Input: { current_password, new_password, confirm_Password }
// Requires Authorization header with Bearer token
exports.changePassword = async (req, res) => {
  try {
  // Extract and verify authorization token
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ _status: false, _message: 'Authorization header is required' })
  const token = auth.split(' ')[1]
  const verifyToken = jwt.verify(token, JWT_SECRET)
  // Fetch authenticated user
  const user = await userModel.findOne({ _id: verifyToken.userData._id, role_type: 'user', deleted_at: null })
  if (!user) return res.status(404).json({ _status: false, _message: 'User not found' })

  // Extract password fields from request
  const { current_password, new_password, confirm_Password } = req.body || {}
  if (!current_password || !new_password || !confirm_Password) return res.send({ _status: false, _message: 'Required field missing' })
  // Verify that current password matches the one in database
  const ok = await bcrypt.compare(current_password, user.password)
  if (!ok) return res.send({ _status: false, _message: 'Current password is incorrect!' })
  // Validate new password and confirm password match
  if (new_password !== confirm_Password) return res.send({ _status: false, _message: 'New password and confirm password must be the same!' })
  // Ensure new password is different from current password
  if (current_password === new_password) return res.send({ _status: false, _message: 'New password cannot be the same as current password!' })

  // Hash new password and update user record
  user.password = await bcrypt.hash(confirm_Password, saltRounds)
  user.updated_at = new Date()
  // Save updated password to database
  const updated = await user.save()
  return res.send({ _status: true, _message: 'Change password successfully', _data: updated })
  } catch (err) {
  return res.status(500).json({ _status: false, _message: 'Something went wrong', _error: err.message })
  }
}

// Initiate forgot password flow
// Input: { email }
// Generates a reset token, saves to user, and emails reset link
exports.forgotPassword = async (req, res) => {
  try {
  // Extract email from request body
  const { email } = req.body || {}
  if (!email) return res.send({ _status: false, _message: 'Email is required' })

  // Find user by email
  const user = await userModel.findOne({ email, role_type: 'user', deleted_at: null })
  await user.save()

console.log("NEW SAVED ID =>", user._id.toString());
console.log("NEW SAVED TOKEN =>", user.resetPasswordToken);
console.log("NEW EXPIRES =>", user.resetPasswordExpires);
  console.log("SAVED ID =>", user._id.toString());
console.log("SAVED TOKEN =>", user.resetPasswordToken);
console.log("EXPIRES =>", user.resetPasswordExpires);
  if (!user) return res.send({ _status: false, _message: 'Email does not exist' })

  // Generate secure random token for password reset
  const token = crypto.randomBytes(32).toString('hex')
  // Save token and expiry time (1 hour) to user record
  user.resetPasswordToken = token
  // user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
  await user.save()

  // Configure email transporter (Gmail SMTP)
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE || 'gmail',
    auth: { user: process.env.gmail_email, pass: process.env.gmail_app_password }
  })

  // Create reset password link with token and user ID
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&id=${user._id}`
  // Send password reset email to user
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@example.com',
    to: user.email,
    subject: 'Password reset request',
    html: `<p>You requested a password reset. Click the link below to reset your password. The link is valid for 1 hour.</p><p><a href="${resetUrl}">Reset Password</a></p>`
  })

  return res.send({ _status: true, _message: 'Password reset email sent', _info: info.messageId })
  } catch (err) {
  console.error('Error in forgotPassword:', err)
  return res.send({ _status: false, _message: 'Something went wrong' })
  }
  
}

// Complete password reset using token
// Input: { id, token, new_password, confirm_password }
exports.resetPassword = async (req, res) => {
  try {
    console.log("RESET API HIT");
    console.log("RESET BODY =>", req.body);
   

  // Extract reset token, user ID, and new passwords from request
  const { token,  new_password, confirm_password } = req.body || {}
console.log("POSTMAN TOKEN =>", token);
  if (!token || !new_password || !confirm_password) return res.send({ _status: false, _message: 'Required fields missing' })
    console.log("TOKEN =", token);
console.log("NEW =", new_password);
console.log("CONFIRM =", confirm_password);
  // Verify new password and confirm password match
  if (new_password !== confirm_password) return res.send({ _status: false, _message: 'Passwords do not match' })
    const dbUser = await userModel.findOne({
  resetPasswordToken: token.trim()
})

console.log("DB USER BY TOKEN =>", dbUser);

  // Find user by ID, token, and check if token is not expired ($gt = greater than current time)
  const user = await userModel.findOne({
  resetPasswordToken: token
})
//   const user = await userModel.findOne({ _id: id, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }, role_type: 'user', deleted_at: null })
  console.log("FOUND USER =>", user);
  if (!user) return res.send({ _status: false, _message: 'Invalid or expired token' })

  // Hash new password and save to user record
  user.password = await bcrypt.hash(new_password, saltRounds)
  // Clear reset token and expiry after successful reset
  user.resetPasswordToken = ''
  user.resetPasswordExpires = null
  user.updated_at = new Date()
  // Save updated user to database
  await user.save()

  return res.send({ _status: true, _message: 'Password has been reset successfully' })
  } catch (err) {
  console.error('Error in resetPassword:', err)
  return res.send({ _status: false, _message: 'Something went wrong' })
  }
}