const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");


// Route Status Check
router.get('/', verifySession() ,async(req,res) => {
    res.status(200).send("Patient Route -> OK");
})

//-----------------Patients-----------------//

// Assign Patient to User
router.post('/allot', verifySession() ,controller.allotPatientId);

router.post("/scan-qr",verifySession(), controller.scanDoctorQR)

// Get Patient Information
router.post('/get', verifySession() ,controller.getPatientInformation);



module.exports = router;
