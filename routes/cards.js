const routerCards = require('express').Router();
const { cards } = require('../controllers/cards');

routerCards.get('/', cards.getAll); // ?возвращает все карточки
routerCards.post('/', cards.createOne); // ? создаёт карточку
routerCards.delete('/:cardsID', cards.deleteOne); // ? удаляет карточку по идентификатору
routerCards.put('/:cardId/likes', cards.likeCard); // ? поставить лайк карточке
routerCards.delete('/:cardId/likes', cards.dislikeCard); // ? убрать лайк с карточки

module.exports = routerCards;
