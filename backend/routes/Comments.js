const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");


router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  // Affiche tout les commentaires
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

// Crée le post
router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  const newComment = await Comments.create(comment);
  res.json(newComment);
});

// Supprime le post
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;