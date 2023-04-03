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


// Get VPA of User
router.post('/fetch', verifySession() ,controller.getVpa);



module.exports = router;
