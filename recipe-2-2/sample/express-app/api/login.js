const router = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../config/jwt.config')
const promisePool = require('../config/db.js')

router.get('/', (req, res) => {
  const authHeader = req.headers.authorization
  const token = req.cookies.token
    ? req.cookies.token
    : authHeader && authHeader.split(' ')[1]
  if (token) {
    jwt.verify(token, config.jwt.secret, (error, _) => {
      if (error) {
        return res.status(200).send({
          isSuccess: false,
          message: 'トークンの認証に失敗しました。',
        })
      } else {
        return res.status(200).send({
          isSuccess: true,
          message: 'success',
        })
      }
    })
  } else {
    return res.status(200).send({
      isSuccess: false,
      message: 'トークンがありません。',
    })
  }
})

router.post('/', async (req, res) => {
  const [rows, fields] = await promisePool.query(
    'select id,name,email,password from users where email = ?',
    req.body.email
  )

  if (
    req.body.email === rows[0].email &&
    req.body.passWord === rows[0].password
  ) {
    const payload = {
      email: req.body.email,
    }
    const token = jwt.sign(payload, config.jwt.secret, config.jwt.options)
    res.cookie('token', token, {
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    res.json({
      isSuccess: true,
      token: token,
    })
  } else {
    res.json({
      isSuccess: false,
      message: 'ユーザーIDまたはパスワードが違います。',
    })
  }
})

module.exports = router
