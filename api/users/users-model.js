const db = require('../../data/dbConfig');

function findBy(filter) {

  return db('users')
    .select('username','password')
    .where(filter)
}

function findById(id) {
      return db('users')
      .select('users.id', 'users.username', 'users.password')
      .where('users.id', id).first()
  }

  async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
  }

module.exports = {
  add,
  findById,
  findBy,
};