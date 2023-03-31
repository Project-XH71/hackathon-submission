const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");


router.get('/', verifySession(), async(req,res) => res.send({status: "ok"}));

// User Setting
router.post('/update', verifySession(), controller.update);


// User Info
router.post('/info', verifySession(), controller.info);






module.exports = router;
