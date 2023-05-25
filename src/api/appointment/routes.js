const express = require('express');
const router = express.Router();
const controller = require('./controller.js');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");


// Route Status Check
router.get('/', verifySession() ,async(req,res) => {
    res.status(200).send("Appointment Route -> OK");
})

//-----------------Appointment-----------------//

router.post('/create', verifySession() ,controller.createAppointment);

router.post("/fetch", verifySession(), controller.fetchAppointments);

router.post("/update", verifySession(), controller.updateAppointment);

router.post("/delete", verifySession(), controller.deleteAppointment);

// router.post("/scan-qr",verifySession(), controller.scanDoctorQR)




module.exports = router;
