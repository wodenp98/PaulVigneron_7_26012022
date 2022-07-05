const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

// S'enregistrer
router.post("/", async (req, res) => {
	// On recupère les données du body
  const { username, password } = req.body;
  const user = await Users.findOne({ where : { username : username}})
 

  if (user ) {
	//   On verifie si l'utilisateur n'existe pas déjà
	  res.json({ error : 'utilisateur existant'})
  } else {
	//   On crypte le mot de passe
	  
		// Puis on créé l'utilisateur
		try{  
			const hash = await bcrypt.hash(password, 10) 
			await Users.create({
		  username: username,
		  password: hash,
		});
		res.json("SUCCESS");  }
		catch(error) {
		 console.log(error)
			res.json("error")
		
		}
		
		

  }
});

// Se connecter
router.post('/login', async (req, res) => {
	const { username, password } = req.body
	const user = await Users.findOne({ where: { username: username } }) 

	if (!user) { 
		res.json({ error: "L'utilisateur n'existe pas !" })
	} else {
		// On vérifie si les données sont exactes
		bcrypt.compare(password, user.password).then(async (match) => { 
			if (!match) { 
				// On renvoie l'erreur
				res.json({ error: 'Mauvaise combination' }) 
			} else {
				// On crée un token
				const accessToken = sign(
					{ username: user.username, id: user.id }, 
					"importantsecret" 
				)
				
				res.json({ token: accessToken, username: username, id: user.id, isAdmin: user.isAdmin })
			}
		})
	}
})

// L'utilisateur est il authentifié?
router.get('/verify', validateToken, async (req, res) => {
	// On récupère username de validateToken
	const { username } = req.user 

	const user = await Users.findOne({ where: { username: username } }) 

	// Est il admin?
	req.user.isAdmin = user.isAdmin
	// User valide
	res.json(req.user)
})

// Info du profil
router.get("/basicInfo/:id", async (req, res) => {
	// On le fait grâce à l'id
  const id = req.params.id;

//   On ne met pas le mot de passe dans les infos utilisateurs
  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

// Modifie le mot de passe
router.put('/changepassword', validateToken, async (req, res) => {
	// On récupère l'ancien et le nouveau
	const { oldPassword, newPassword } = req.body 

	const user = await Users.findOne({ where: { username: req.user.username } })

	bcrypt.compare(oldPassword, user.password).then(async (match) => {
		if (!match)  { 
			res.json({ error: 'Mauvais mot de passe' })
		} else {
			// On hash le nouveau mot de passe
			bcrypt.hash(newPassword, 10).then((hash) => {
				// On met à jour le mot de passe dans la table
				Users.update( 
					{ password: hash },
					{ where: { username: req.user.username } }
				)
				res.json('Mot de passe changé')
			})
		}
	})
})

// Supprime un utilisateur
router.delete('/deleteUser/:id', validateToken, async (req, res) => {
	const userId = req.params.id
	// grâce à sequelize et à l'id
	await Users.destroy({
		where: {
			id: userId,
		},
	})

	res.json('Compte supprimé')
})

module.exports = router;
