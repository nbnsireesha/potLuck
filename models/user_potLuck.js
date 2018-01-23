module.exports = function(sequelize, DataTypes) {
  var UserPotluck = sequelize.define("UserPotluck", {
    food: DataTypes.STRING,
    coming: DataTypes.STRING,
    usename: DataTypes.STRING,
    idOfPotLuck: DataTypes.STRING
 });
  UserPotluck.associate = function(models) {
  console.log(models);
   models.UserPotluck.belongsTo(models.User);
   // models.UserPotluck.belongsTo(models.PotLuck);
    
  };
  return UserPotluck;
}