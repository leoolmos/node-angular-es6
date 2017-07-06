let users = {};


users.index = (req, res, next) => {
  res.status(200).send('Users API INDEX')
}


export default users
