const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../_secure");

// module.exports.createMedicalCaseByDoctor = async(req,res) => {
//     try {
//         const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;
//         const { patientVpa } = req.body;

//         const pvData = await prisma.user_vpa.findUnique({
//             where:{
//                 vpa: patientVpa
//             },
//             select:{
//                 userId: true
//             }
//         })

//         const visit = await prisma.visits.create({
//             data:{
//                 doctor_visits:{
//                     create:{
//                         doctor:{
//                             connect:{
//                                 id: doctorId
//                             }
//                         },
//                         patient:{
//                             connect:{
//                                 userId: pvData.userId
//                             }
//                         },
//                     }
//                 },
//                 medical_case:{
//                     create:{
//                         data: "No Data"
//                     }
//                 },
//             },
//             include:{
//                 doctor_visits: true,
//                 medical_case: true
//             }
//         })

//         return res.send(visit);


//     } catch (error) {
//         return res.status(200).send()
//     }
// }




// module.exports.updateMedicalCase = async(req,res) => {
//     try {
//         const {doctorId} = (await UserMetadata.getUserMetadata(req.session.getUserId())).metadata;
//         const { patientVpa, data } = req.body;

//         const pvData = await prisma.user_vpa.findUnique({
//             where:{
//                 vpa: patientVpa
//             },
//             select:{ 
//                 userId: true
//             }
//         })

//         const visit = await prisma.visits.findMany({
//             where:{
//                 doctor_visits:{
//                      every:{
//                         doctorId: doctorId,
//                         patientId: pvData.userId
//                      }
//                 },   
//             },
//             select:{
//                 medical_case: true
//             }
//         })

//         const updatedMedicalCase = await prisma.medical_case.update({
//             where:{
//                 id: visit[0].medical_case.id
//             },
//             data:{
//                 data: data
//             }
//         })

//         return res.send(updatedMedicalCase);

//     } catch (error) {
//         return res.status(200).send()
//     }
// }



module.exports.updateMedicalCaseData = async(req,res) => {
    try {
        const { data, medicalCaseid } = req.body;
        // const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(data));

        const transaction = await prisma.$transaction();

        // Get Old Medical Case Data

        const getMedicalCase = await prisma.medical_case.findUnique({
            where:{
                id: medicalCaseid
            }
        });

        // Get Old Secret Key
        const getSecretKey = await prisma.backend_escrow.findUnique({
            where:{
                key: getMedicalCase.id
            }
        });

        // Decrypt Old Medical Case Data
        const decryptData = _secure.decryption.decryptData(getMedicalCase.data, getSecretKey.secretKey, getSecretKey.secretVI);


        // Update Medical Case Data
        const updatedData = {...decryptData, ...data};


        // Encrypt New Medical Case Data
        const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(updatedData));

        // Update Medical Case Data
        const updatedMedicalCase = await prisma.medical_case.update({
            where:{
                id: getMedicalCase.id
            },
            data:{
                data: cipher
            }
        },transaction)

        // Update Secret Key
        const updatedSecretKey = await prisma.backend_escrow.update({
            where:{
                id: getSecretKey.id
            },
            data:{
                secretKey: secretKey,
                secretVI: secretVI
            }
        }, transaction);


        return res.send({message: "Data Updated"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.createLabReport = async(req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}

module.exports.createLabReport = async(req,res) => {
    try {
        
    } catch (error) {
        return res,status(500).send({message: error.message});
    }
}



// module.exports.updateMedicalCaseData = async(req,res) => {
//     try {
//         const { data } = req.body;
//         const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(data));

//         const decryptData = _secure.decryption.decryptData(cipher, secretKey, secretVI);

//         console.log("Ecy Data:",cipher);
//         console.log("Ecy Key:",secretKey);
//         console.log("Ecy IV:",secretVI);

//         return res.send({cipher, secretKey, secretVI, decryptData: JSON.parse(decryptData)});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({message: error.message});
//     }

