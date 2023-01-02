/* eslint-disable class-methods-use-this */
const { MESSAGE, STATUS } = require('../utils/constants');
const { NotFound } = require('../utils/NotFound');
const card = require('../models/Card');

// ? ошибки
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { BadRequestError } = require('../errors/BadRequestError');

class Cards {
  // ? возвращает все карточки
  getAll(req, res) {
    card.find({})
      .then((cards) => {
        if (cards) {
          res.send({ data: cards });
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

  // ? создает карточку
  createOne(req, res) {
    const { name, link } = req.body;
    card.create({ name, link, owner: req.user._id })
      .then((data) => res.status(STATUS.INFO.CREATED).send({ message: `CARD ${MESSAGE.INFO.CREATED}`, Data: data }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }
      });
  }

  // ? удаляет карточку
  deleteOne(req, res, next) {
    const userId = req.user._id;

    card.findById({ _id: req.params.cardsID })
      .then((data) => {
        if (!data) {
          throw new NotFoundError(MESSAGE.ERROR.NOT_FOUND);
        }
        if (!data.owner.equals(userId)) {
          throw new ForbiddenError(MESSAGE.ERROR.FORBIDDEN);
        }
        card.findByIdAndDelete({ _id: req.params.cardsID })
          .orFail(() => new NotFoundError(MESSAGE.ERROR.NOT_FOUND))
          .then(() => {
            res.send({ message: MESSAGE.INFO.DELETE });
          });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestError(MESSAGE.ERROR.BAD_REQUEST));
        } else {
          next(err);
        }
      });
  }

  // ? добавляем лайк на карточке
  likeCard(req, res, next) {
    card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((data) => {
        if (data === null) {
          return res.status(STATUS.ERROR.NOT_FOUND).send({ message: `CARD ${MESSAGE.ERROR.NOT_FOUND}` });
        }
        return res.status(STATUS.INFO.OK).send({ message: `LIKE ${MESSAGE.INFO.PUT}` });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          next(err);
        }
      });
  }

  // ? убираем лайк на карточке
  dislikeCard(req, res, next) {
    card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((data) => {
        if (data === null) {
          return res.status(STATUS.ERROR.NOT_FOUND).send({ message: `CARD ${MESSAGE.ERROR.NOT_FOUND}` });
        }
        return res.status(STATUS.INFO.OK).send({ message: `like ${MESSAGE.INFO.DELETE}` });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          next(err);
        }
      });
  }
}

const cards = new Cards();

module.exports = { cards };
