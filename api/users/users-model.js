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

async function add({ username, password }) { /// FIX THIS
  let created_user_id
  await db.transaction(async trx => {
    let role_id_to_use
    const [role] = await trx('roles').where('role_name', role_name)
    if (role) {
      role_id_to_use = role.role_id
    } else {
      const [role_id] = await trx('roles').insert({ role_name: role_name })
      role_id_to_use = role_id
    }
    const [user_id] = await trx('users').insert({ username, password, role_id: role_id_to_use })
    created_user_id = user_id
  })
  return findById(created_user_id)
}

module.exports = {
  add,
  findBy,
};