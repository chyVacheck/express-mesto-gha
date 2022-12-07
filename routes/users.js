const routerUsers = require('express').Router();
const { users } = require('../controllers/users');

routerUsers.get('/', users.getAll); // ? возвращает всех пользователей
routerUsers.get('/:userId', users.getOne); // ? возвращает пользователя по _id
routerUsers.post('/', users.createOne); // ? создаёт пользователя
routerUsers.patch('/me', users.setUserInfo); // ? обновляет профиль
routerUsers.patch('/me/avatar', users.setUserAvatar); // ? обновляет аватар

module.exports = routerUsers;
