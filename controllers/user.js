const User = require('../models/user')

exports.postRegister = async (req, res, next) => {
   const username = req.body.username
   const password = req.body.password
   let user = await User.find({username: username}).exec()
   if(user.length > 0) {
      return res.status(400).json("Alrealy having user with that username")
   }
   let newUser = new User({
      username, password
   })
   let result = await newUser.save()
   res.status(200).json("Success")
}

exports.postLogin = async (req, res, next) => {
   const username = req.body.username
   const password = req.body.password
   let user = await User.findOne({username: username, password: password}).exec()
   if(user.length < 0) {
      return res.status(400).json("Wrong user name or password")
   }
   res.status(200).json({
      _id: user._id,
      username: user.username
   })
}
exports.postFindAccount = async (req, res, next) => {
   const _id = req.body._id
   let user = await User.findById(_id).exec()
   if(user.length < 0) {
      return res.status(400).json("No Account found")
   }
   res.status(200).json(true)
}

