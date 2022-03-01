// Table Post
module.exports = (sequelize, DataTypes) => {

	const Posts = sequelize.define('Posts', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		postText: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		imageUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	})
// Si un post est delete on delete également commentaire et likes
	Posts.associate = (models) => {
		Posts.hasMany(models.Comments, {
			onDelete: "cascade",
		});

		Posts.hasMany(models.Likes, {
			onDelete: "cascade",
		});
	};
	return Posts
}