const express = require('express');
const app = express();
const cors = require('cors')

app.use(express.json());
// on autorise les requetes entre notre clien et notre server
app.use(cors());

// Import des models
const db = require('./models')

// Routers
const {router} = require("./routes/Posts");
app.use("/posts", router);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

// Connexion au serveur
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
})



