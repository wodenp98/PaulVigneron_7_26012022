// Table User
module.exports = (sequelize, DataTypes) => { 
	const Users = sequelize.define("Users", { 
	  username: {
		type: DataTypes.STRING,
		allowNull: false,
	  },
	  password: {
		type: DataTypes.STRING,
		allowNull: false,
	  },

	isAdmin: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	  },

	});
//   Un user peut faire plusieurs posts et commentaires et faire plusieurs likes
	Users.associate = (models) => {
	  Users.hasMany(models.Likes, {
		onDelete: "cascade",
	  });
  
	  Users.hasMany(models.Posts, {
		onDelete: "cascade",
	  });
  
	  Users.hasMany(models.Comments, {
			  onDelete: 'cascade',
		  })
	};
  
	return Users;
  };