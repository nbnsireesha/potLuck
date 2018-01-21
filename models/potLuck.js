module.exports = function(sequelize, DataTypes) {
  var PotLuck = sequelize.define("PotLuck", {
    // Giving the Author model a name of type STRING
    date: DataTypes.DATE,
    guestEmails: DataTypes.STRING,

  });

  PotLuck.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    PotLuck.belongsTo(models.User, {
 // PotLuck.associate = function(models) {
 //  console.log(models);
 //   models.Potluck.belongsToMany(models.User, { through: models.UserPotluck, foriegnKey: "user_id" })
    
 //  };
    });
  };
  return PotLuck;
};