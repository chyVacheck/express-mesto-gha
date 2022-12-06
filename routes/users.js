
const { users } = require('../controllers/users');

const routerUsers = require('express').Router();

routerUsers.get('/', users.getAll); //? возвращает всех пользователей
routerUsers.get('/:userId', users.getOne); //? возвращает пользователя по _id
routerUsers.post('/', users.createOne); //? создаёт пользователя
routerUsers.patch('/me', users.setUserInfo); //? обновляет профиль
routerUsers.patch('/me/avatar', users.setUserAvatar); //? обновляет аватар

module.exports = routerUsers;
