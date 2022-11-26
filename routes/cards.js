
const {
  getAllCards, createCard, deleteCard, changeCardLikes,
} = require('../controllers/cards');

const routerCards = require('express').Router();

routerCards.get('/', getAllCards); //?возвращает все карточки
routerCards.post('/', createCard); //? создаёт карточку
routerCards.delete('/:cardsID', deleteCard); //? удаляет карточку по идентификатору
routerCards.put('/:cardId/likes', changeCardLikes); //? поставить лайк карточке
routerCards.delete('/:cardId/likes', changeCardLikes); //? убрать лайк с карточки

module.exports = routerCards;
