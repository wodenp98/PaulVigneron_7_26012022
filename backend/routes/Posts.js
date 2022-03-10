const express = require('express')
const router = express.Router() 
const { Posts, Likes, Comments } = require('../models')

const { validateToken } = require('../middlewares/AuthMiddleware')
const { uploadImage } = require('../middlewares/multer')



// Affiche tout les posts
router.get('/', validateToken, async (req, res) => {
	const listOfPosts = await Posts.findAll({ 
		include: [Likes, Comments],
		// Plus récent au plus ancien
		order: [['id', 'DESC']],
	})

	console.log(listOfPosts)
// trouver tout les likes
	const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } })

	res.json({ listOfPosts, likedPosts })

})

// Affiche individuellement les posts
router.get('/byId/:id', async (req, res) => {
	const id = req.params.id 

	// On récupère le post grâce à l'id
	const post = await Posts.findByPk(id) 
	res.json(post)
})

// Affiche les posts d'un user
router.get('/byUserId/:id', async (req, res) => {
	const id = req.params.id

	// Tout les posts d'un utilisateur
	const listOfPosts = await Posts.findAll({
		where: { UserId: id },
		include: [Likes],
		order: [['id', 'DESC']],
	})
	res.json(listOfPosts)
})

// Crée un post (avec texte et image)
router.post('/', validateToken, uploadImage, async (req, res) => {
	post = req.body 
	post.username = req.user.username
	post.UserId = req.user.id
	post.createdAt = req.user.createdAt
	// On vérifie si la création contient une image
	if(!req.file) {
		post.imageUrl = null
	}
	
	else {
		// Si oui on ajoute l'image
		post.imageUrl = req.file.filename 
	}

	// On crée le post
	await Posts.create(post) 
	res.json(post)
})	

// Modifie le titre
router.put('/title', validateToken, async (req, res) => {
	const { newTitle, id } = req.body
	await Posts.update({ title: newTitle }, { where: { id: id } }) 
	res.json(newTitle)
})

// Modifie le body
router.put('/postText', validateToken, async (req, res) => {
	const { newText, id } = req.body 
	// On le fait grâce à l'id
	await Posts.update({ postText: newText }, { where: { id: id } }) 
	res.json(newText)
})

// Supprime le post
router.delete('/:postId', validateToken, async (req, res) => {
	const postId = req.params.postId
	await Posts.destroy({ 
		where: {
			id: postId,
		},
	})

	res.json('Supprimé')
})

module.exports.router = router