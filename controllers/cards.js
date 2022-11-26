
function getAllCards(req, res) {
  console.log('getAllCards');
  res.send('123');
}

function createCard(req, res) {
  console.log('createCard');
}

function deleteCard(req, res) {
  console.log('deleteCard');
}

function changeCardLikes(req, res) {
  console.log('changeCardLikes');
}

module.exports = { getAllCards, createCard, deleteCard, changeCardLikes }
