const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");

module.exports.allotPatientId = async(req,res) => {
    try {
        const userId = req.session.getUserId();

        const patient = await prisma.patient.upsert({
            where:{
                userId
            },
            create:{
                userId
            },
            update:{},
            include:{
                user: true
            }
        })

        await UserMetadata.updateUserMetadata(userId, {patientId: patient.id})

        return res.status(200).json({...patient})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}


module.exports.scanDoctorQR = async(req,res) => {
    try {

        const { uhiId } = req.body;
        const userId = req.session.getUserId();

        const user_vpa = await prisma.user_vpa.findUnique({
            where:{
                vpa: uhiId
            },
            include:{
                user : true
            }
        })

        const doctor = await prisma.doctor.findUnique({
            where:{
                userId: user_vpa.userId
            }
        })

        const secureData = await prisma.backend_pat_doc_verification.create({
            data:{
                doctor:{
                    connect:{
                        id: doctor.id
                    }
                },
                patient:{
                    connect:{
                        userId: userId
                    }
                },
                otp: Math.floor(100000 + Math.random() * 900000),
                status: "PENDING"
            }
        })

        return res.status(200).json({...secureData, otp: "******"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

