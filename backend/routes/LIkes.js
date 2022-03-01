const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Like un post
router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  // Est ce que la ligne dans la table existe?
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  // Si non
  if (!found) {
    // On crée la ligne
    await Likes.create({ PostId: PostId, UserId: UserId });
    res.json({liked: true});
  } else {
    // Sinon on dislike
    await Likes.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    res.json({liked: false});
  }
});

module.exports = router;