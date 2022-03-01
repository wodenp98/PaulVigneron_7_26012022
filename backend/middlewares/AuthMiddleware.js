const { verify } = require("jsonwebtoken")

// on vérifie le token
const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")

// Utilisateur connecté?
    if (!accessToken) return res.json({error: "User not logged in"})

    // Token valide? vérification avec jsonwebtoken
    try {
        const validToken = verify(accessToken, "importantsecret")
        req.user = validToken;
        
        // Token validé, donc on poursuit la req
        if (validToken) {
            return next();
        }

    } catch (err) {
        return res.json({ error: err })
    }
}

module.exports = { validateToken }