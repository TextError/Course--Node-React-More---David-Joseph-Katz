const pool = require('../../databasePool');
const DragonTable = require('./table');
const Dragon = require('./index');

const getDragondWithTraits = ({dragonId}) => {
  return Promise.all([
    DragonTable.getDragon({dragonId}),
    new Promise((resolve, reject) => {
      pool.query(`
        SELECT "traitType", "traitValue" 
        FROM trait
        INNER JOIN dragonTrait ON trait.id = dragonTrait."traitId"
        WHERE dragonTrait."dragonId" = $1
      `,
        [dragonId],
        (err, response) => {
          if(err) return reject(err);
          resolve(response.rows);
        }
      )
    })
  ])
  .then(([dragon, dragonTraits]) => {
    return new Dragon({...dragon, dragonId, traits: dragonTraits })
  })
  .catch(err => console.error(err));
};

getDragondWithTraits({ dragonId: 1 })
  .then(dragon => console.log(dragon))
  .catch(err => console.log(err))

const getPublicDragons = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT id FROM dragon WHERE "isPublic" = TRUE',
      (error, response) => {
        if(error) return reject(error);
        const publicDragonRows = response.rows;
        Promise.all(publicDragonRows.map(({ id }) => getDragondWithTraits({ dragonId: id })))
          .then(dragons => resolve({ dragons }))
          .catch(error => reject(error));
      }
    )
  });
};

module.exports = { getDragondWithTraits, getPublicDragons };