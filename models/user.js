module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the Author model a name of type STRING
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNo: DataTypes.STRING
  });

  User.associate = function(models) {
   //models.User.belongsToMany(models.PotLuck, { through: models.UserPotluck, foriegnKey: "potluck_id" })
      //models.User.belongsToMany(models.PotLuck, { through: models.UserPotluck})
  };
  return User;
};