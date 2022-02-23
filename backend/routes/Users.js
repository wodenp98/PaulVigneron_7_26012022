const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where : { username : username}})

  if (user ) {
	  res.json({ error : 'utilisateur existant'})
  } else {
	bcrypt.hash(password, 10).then((hash) => {
		Users.create({
		  username: username,
		  password: hash,
		});
		res.json("SUCCESS");
	  });
  }
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body
	const user = await Users.findOne({ where: { username: username } }) 

	if (!user) { 
		res.json({ error: "L'utilisateur n'existe pas !" })
	} else {
		bcrypt.compare(password, user.password).then(async (match) => { 
			if (!match) { 
				res.json({ error: 'Mauvaise combination' }) 
			} else {
				
				const accessToken = sign(
					{ username: user.username, id: user.id }, 
					"importantsecret" 
				)
				
				res.json({ token: accessToken, username: username, id: user.id, isAdmin: user.isAdmin })
			}
		})
	}
})

router.get('/verify', validateToken, async (req, res) => {
	const { username } = req.user 

	const user = await Users.findOne({ where: { username: username } }) 

	req.user.isAdmin = user.isAdmin
	res.json(req.user)
})

router.get("/basicInfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put('/changepassword', validateToken, async (req, res) => {
	const { oldPassword, newPassword } = req.body 

	const user = await Users.findOne({ where: { username: req.user.username } })

	bcrypt.compare(oldPassword, user.password).then(async (match) => {
		if (!match)  { 
			res.json({ error: 'Mauvais mot de passe' })
		} else {

			bcrypt.hash(newPassword, 10).then((hash) => {
				Users.update( 
					{ password: hash },
					{ where: { username: req.user.username } }
				)
				res.json('Mot de passe changé')
			})
		}
	})
})


router.delete('/deleteUser/:id', validateToken, async (req, res) => {
	const userId = req.params.id
	await Users.destroy({
		where: {
			id: userId,
		},
	})

	res.json('Compte supprimé')
})

module.exports = router;