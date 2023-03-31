const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");


// Route Status Check
router.get('/', verifySession() ,async(req,res) => {
    res.status(200).send("VPA Route -> OK");
})

//-----------------VPA-----------------//

// Assign VPA to User
router.post('/assign', verifySession() ,controller.assignVpaToUser);



module.exports = router;
