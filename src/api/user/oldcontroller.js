const prisma = require("../../primsaInit");
const firebaseAdmin = require("../../firebase");
const { v4: uuidv4 } = require('uuid');


// User Registration
module.exports.registerAccount = async (req, res) =>  {
    let userRecord = null;
    try {
        const { email, name } = req.body;

        userRecord = await firebaseAdmin.auth().createUser({
            email,
            emailVerified: false,
            displayName: name,
            disabled: false,
        });

        const user = await prisma.user.create({
            data:{
                id: userRecord.uid,
                name: userRecord.displayName,
                email: userRecord.email,   
            }
        });

        return res.status(200).send({mesage:"ok", ...user});
    } catch (error) {
        console.log(error);
        if(userRecord) await firebaseAdmin.auth().deleteUser(userRecord.uid);
        return res.status(500).send({ error: error.message });
    }
}

module.exports.requestUserRegistrationOTP = async (req, res) => {
    try {

        const user = await prisma.user.findUnique({
            where:{
                email: req.body.email
            }
        });
        if(user) return res.status(400).send({ error: "User already exists" });


        // If user not exists, create a new OTP and send it over email
        const otpValue = Math.floor(100000 + Math.random() * 900000);


        const otp = await prisma.verificationOTP.create({
            data:{
                id: uuidv4().replace(/-/g, ''),
                userId: req.body.email,
                mode: "email",
                type: "user-registration",
                value: otpValue,
                expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
                data:{
                    name: req.body.name,
                    email: req.body.email
                }
            }
        });

        //Send otp over Email
        console.log(otp);

        
        return res.status(200).send({mesage:"ok"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
};

module.exports.verifyUserRegistrationOTP = async(req,res) => {
    try {
        let userRecord = null;
        try {

            const otpData = await prisma.verificationOTP.findFirst({
                where:{
                    type: "user-registration",
                    mode: "email",
                    value: req.body.otp,
                    AND:{
                        expireAt:{
                            lte: new Date() // less than or equal to current time
                        }
                    }
                }
            })
            
            if(!otpData) return res.status(400).send({ error: "Invalid OTP or OTP Expired." });

            userRecord = await firebaseAdmin.auth().createUser({
                email: otpData.data.email,
                emailVerified: true,
                displayName: otpData.data.name,
                disabled: false,
            });
    

            const user = await prisma.user.create({
                data:{
                    id: userRecord.uid,
                    name: userRecord.displayName,
                    email: userRecord.email,   
                }
            });
    
            return res.status(200).send({mesage:"ok", ...user});
        } catch (error) {
            console.log(error);
            if(userRecord) await firebaseAdmin.auth().deleteUser(userRecord.uid);
            return res.status(500).send({ error: error.message });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}





// User Login
module.exports.requestUserLoginOTP = async(req,res) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                email: req.body.email
            }
        });

        if(!user) return res.status(400).send({ error: "User not Registered Yet!" });

        // If user exists, create a new OTP and send it over email
        const otpValue = Math.floor(100000 + Math.random() * 900000);
        const otp = await prisma.verificationOTP.create({
            data:{
                id: uuidv4().replace(/-/g, ''),
                userId: user.email,
                mode: "email",
                type: "user-login",
                value: otpValue,
                expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
                data:{
                    email: user.email,
                    id: user.id
                }
            }
        });

        //Send the OTP Over Email
        console.log(otp);

        return res.status(200).send({mesage:"ok"});

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}

module.exports.verifyUserLoginOTP = async(req,res) => {
    try {

        const otpData = await prisma.verificationOTP.findFirst({
            where:{
                type: "user-login",
                mode: "email",
                value: req.body.otp,
                AND:{
                    expireAt:{
                        lte: new Date() // less than or equal to current time
                    }
                }
            }
        })
        
        if(!otpData) return res.status(400).send({ error: "Invalid OTP or OTP Expired." });

        const loginToken = await firebaseAdmin.auth().createCustomToken(otpData.data.id);

        return res.status(200).send({mesage:"ok", loginToken});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}

// User Update Profile
module.exports.updateProfile = async(req,res) => {
    try {
        const userAuth = req.user;

        const user = await prisma.user.update({
            where:{
                id: userAuth.uid
            },
            data:{
                ...req.body.data
            },
            include:{
                userDepartment: true,
            }
        });

        return res.status(200).send({mesage:"ok", ...user});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}


module.exports.departmentControl = async(req,res) => {
    try {
        const query = req.params.query;
        const userAuth = req.user;
        let departmentData = null;


        //Update Department
        if(query === 'update'){
            departmentData = await prisma.user.update({
                where:{
                    id: userAuth.uid
                },
                data:{
                    userDepartment:{
                        update:{
                            where:{
                                id: req.body.data.oldDepartmentId
                            },
                            data:{
                                department:{
                                    connect:{
                                        id: req.body.data.departmentId
                                    }
                                },
                                dateStarted: req.body.data.dateStarted,
                                dateEnded: req.body.data.dateEnded
                            }
                        }
                    }
                }
            }); 
        }

        //Update Create
        if(query === 'create'){
            departmentData = await prisma.user.update({
                where:{
                    id: userAuth.uid
                },
                data:{
                    userDepartment:{
                        create:{
                            department:{
                                connect:{
                                    id: req.body.data.departmentId
                                }
                            },
                            dateStarted: req.body.data.dateStarted,
                            dateEnded: req.body.data.dateEnded
                        }
                    }
                }
            }); 
        }

        //Update Delete
        if(query === 'delete'){
            departmentData = await prisma.user.update({
                where:{
                    id: userAuth.uid
                },
                data:{
                    userDepartment:{
                        delete:{
                            id: req.body.data.departmentId
                        }
                    }
                }
            }); 
        }


        return res.status(200).send({mesage:"ok", ...departmentData});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}


//  GET Profile
module.exports.publicProfile = async(req,res) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: req.body.id
            }
        });

        return res.status(200).send({mesage:"ok", ...user});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}

module.exports.myProfile = async(req,res) => {
    try {
        const userAuth = req.user;

        const user = await prisma.user.findUnique({
            where:{
                id: userAuth.uid
            },
            include:{
                userDepartment: true,
            }
        });

        return res.status(200).send({mesage:"ok", ...user});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
    }
}