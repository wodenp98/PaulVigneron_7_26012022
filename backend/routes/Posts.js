const express = require('express')
const router = express.Router() 
const { Posts, Likes } = require('../models')

const { validateToken } = require('../middlewares/AuthMiddleware')
const { uploadImage } = require('../middlewares/multer')




router.get('/', validateToken, async (req, res) => {
	const listOfPosts = await Posts.findAll({ 
		include: [Likes],
		order: [['id', 'DESC']],
	})


	const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } })


	res.json({ listOfPosts, likedPosts })

})


router.get('/byId/:id', async (req, res) => {
	const id = req.params.id 
	const post = await Posts.findByPk(id) 
	res.json(post)
})


router.get('/byUserId/:id', async (req, res) => {
	const id = req.params.id

	const listOfPosts = await Posts.findAll({
		where: { UserId: id },
		include: [Likes],
		order: [['id', 'DESC']],
	})
	res.json(listOfPosts)
})


router.post('/', validateToken, uploadImage, async (req, res) => {
	post = req.body 
	post.username = req.user.username
	post.UserId = req.user.id
	if(!req.file) {
		post.imageUrl = null
	}
	
	else {
		post.imageUrl = req.file.filename 
	}
	await Posts.create(post) 
	res.json(post)
})	

// Modifie le titre
router.put('/title', validateToken, async (req, res) => {
	const { newTitle, id } = req.body
	await Posts.update({ title: newTitle }, { where: { id: id } }) 
	res.json(newTitle)
})


router.put('/postText', validateToken, async (req, res) => {
	const { newText, id } = req.body 
	await Posts.update({ postText: newText }, { where: { id: id } }) 
	res.json(newText)
})


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