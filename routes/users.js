
const {
  getAllUsers, getUser, createUser, setUserInfo, setUserAvatar,
} = require('../controllers/users');


const routerUsers = require('express').Router();

routerUsers.get('/', getAllUsers);
routerUsers.get('/:userId', getUser);
routerUsers.post('/', createUser);
routerUsers.patch('/me', setUserInfo); //? обновляет профиль
routerUsers.patch('/me/avatar', setUserAvatar); //? обновляет аватар

module.exports = routerUsers;
