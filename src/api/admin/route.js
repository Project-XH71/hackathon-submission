const express = require('express');
const router = express.Router();
const Admin = require('./index.js');
const controller = require("./controller.js");
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const rbac = require("../_auth/rbac.js");

router.get('/status', verifySession(), rbac(false) ,(req, res) => res.send('Welcome to Admin API'));


router.post('/role/create', verifySession(), rbac(), controller.createRole);
router.post('/role/get-all', verifySession(), rbac(), controller.getAllRoles);
router.post('/role/assign', verifySession(), rbac(), controller.assignRole);

router.post('/role/get-all-users', verifySession(), rbac(), controller.getAllUsersThatHaveRole);




router.post('/user/assign_doctor',verifySession(),rbac(),controller.assignUserDoctor);

// router.post('/role/get-all-users', verifySession(), rbac.auth("admin"), controller.getAllUsersThatHaveRole);



module.exports = router;
