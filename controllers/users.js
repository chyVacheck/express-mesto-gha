
const { MESSAGE, STATUS } = require('../utils/constants.js');
const { NotFound } = require('../utils/NotFound.js');
const user = require('../models/user');

class Users {
  //? возвращает всех пользователей
  getAll(req, res) {
    user.find({})
      .then((users) => {
        if (users) {
          res.send({ data: users })
        } else {
          NotFound();
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }
      });
  }

  //? возвращает пользователя
  getOne(req, res) {
    user.findById(req.params.userId)
      .then((user) => {
        if (user) {
          res.send({ data: user })
        } else {
          NotFound();
        }
      })
      .catch((err) => {
        console.log(err.name);
        //? если длина id правильная, но такого нет в базе
        if (err.name === 'TypeError') {
          res.status(STATUS.ERROR.NOT_FOUND).send({ message: 'USER ' + MESSAGE.ERROR.NOT_FOUND });
        } else {
          //? если длина id неверная
          if (err.name === 'CastError') {
            res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
          } else {
            //? для других ошибок
            res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
          }
        }
      });
  }

  //? создает пользователя
  createOne(req, res) {
    const { name, about, avatar } = req.body;

    user.create({ name, about, avatar })
      .then((user) => {
        res.status(STATUS.INFO.CREATED).send({ message: MESSAGE.INFO.CREATED, data: user });
      })
      .catch((err) => {
        if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }

      })
  }

  setUserInfo(req, res) {
    const { name, about } = req.body;
    user.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .then((user) => {
        if (user) {
          res.status(STATUS.INFO.OK).send({ message: 'INFO ' + MESSAGE.INFO.PATCH, name: name, about: about })
        } else {
          res.status(STATUS.ERROR.NOT_FOUND).send({ message: MESSAGE.ERROR.NOT_FOUND });
        }
      })
      .catch((err) => {
        if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }
      });
  };

  setUserAvatar(req, res) {
    const { avatar } = req.body;
    user.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
      .then((user) => {
        if (user) {
          res.status(STATUS.INFO.OK).send({ message: 'AVATAR ' + MESSAGE.INFO.PATCH, avatar: avatar })
        } else {
          res.status(STATUS.ERROR.NOT_FOUND).send({ message: 'USER ' + MESSAGE.ERROR.NOT_FOUND });
        }
      })
      .catch((err) => {
        if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }
      });
  };

}

const users = new Users();

module.exports = { users }
