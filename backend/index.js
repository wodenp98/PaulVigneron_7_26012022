const express = require('express');
const app = express();


const db = require('./models')

// Routes
const userRoute = require('./routes/User')
app.use("/user", userRoute)


db.sequelize.sync().then((req) => {
    app.listen(3001, () => {
        console.log("server running");
    });
})

app.use(express.json())

