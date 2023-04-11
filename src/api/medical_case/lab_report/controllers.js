const prisma = require("../../../primsaInit.js");
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


const ageCalculator = (dob) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}


module.exports.createLabReport = async(req,res) => {

    let labReportDataFinal;
    try {
        const { medicalCaseid, labReportData } = req.body;


        // -> Get Medical Case Data Secret Keys
        // -> Get Medical Case Data
        // -> Get User Metadata (Contains Birthdate)
        // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
        // -> Calculate BMI
        // -> Add these Data to the Lab Report Data
        // -> Append the Lab Report Data from Request Body
        // -> Encrypt the Lab Report Data
        // -> Save the Secret key to the Backend Escrow Table
        // -> Save the Lab Report Data to the Medical Case Tabl


        const labReport = await prisma.$transaction(async(transaction) => {
            // -> Get Medical Case Data Secret Keys
            const medicalCaseSecretKey = await prisma.backend_escrow.findUnique({
                where:{
                    key: medicalCaseid
                }
            });
            

            // -> Get Medical Case Data
            const getMedicalCase = await prisma.medical_case.findUnique({
                where:{
                    id: medicalCaseid
                },
                include:{
                    patient:{
                        include:{
                            user: {
                                include:{
                                    user_metadata: true,
                                    user_vpa: true
                                },
                            }
                        }
                    }
                }
            });


            // -> Get User Metadata (Contains Birthdate)
            const { dateOfBirth } = getMedicalCase.patient.user.user_metadata;
            

            // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
            const decryptMedicalCaseData = _secure.decryption.decryptData(JSON.stringify(getMedicalCase.data), medicalCaseSecretKey.secretKey, medicalCaseSecretKey.secretVI);


            const { weight, height } = decryptMedicalCaseData;

            labReportDataFinal = { ...labReportData, bmi: weight / (height * height), dateOfBirth: dateOfBirth,age: ageCalculator(dateOfBirth) , patientName: getMedicalCase.patient.user.name, patientVpa: getMedicalCase.patient.user.user_vpa.vpa };

            const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(labReportDataFinal));

            const labReport = await prisma.lab_report.create({
                data:{
                    data: cipher,
                    medical_case:{
                        connect:{
                            id: getMedicalCase.id
                        }
                    }
                }
            })

            await prisma.backend_escrow.upsert({
                where:{
                    key: labReport.id 
                },
                create:{
                    key: labReport.id,
                    secretKey: secretKey,
                    secretVI: secretVI
                },
                update:{
                    secretKey: secretKey,
                    secretVI: secretVI
                }
            })

            return labReport
        })
        

        

        await transaction.commit();

        return res.send({...labReport, data: labReportDataFinal });


    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({message: error.message});
    }
}


module.exports.updateLabReport = async(req,res) => {

    let labReportDataFinal;
    try {
        const { medicalCaseid, labReportData } = req.body;


        // -> Get Medical Case Data Secret Keys
        // -> Get Medical Case Data
        // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
        // -> Append the Lab Report Data from Request Body
        // -> Encrypt the Lab Report Data
        // -> Save the Secret key to the Backend Escrow Table
        // -> Save the Lab Report Data to the Medical Case Tabl


        const labReport = await prisma.$transaction(async(transaction) => {
            // -> Get Medical Case Data Secret Keys
            const medicalCaseSecretKey = await transaction.backend_escrow.findUnique({
                where:{
                    key: medicalCaseid
                }
            });
            

            // -> Get Medical Case Data
            const getMedicalCase = await transaction.medical_case.findUnique({
                where:{
                    id: medicalCaseid
                }
            });


            
            

            // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
            const decryptMedicalCaseData = _secure.decryption.decryptData(getMedicalCase.data, medicalCaseSecretKey.secretKey, medicalCaseSecretKey.secretVI);

            labReportDataFinal = { ...labReportData, ...JSON.parse(decryptMedicalCaseData)};

            const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(labReportDataFinal));

            const labReport = await transaction.lab_report.create({
                data:{
                    data: cipher,
                    medical_case:{
                        connect:{
                            id: getMedicalCase.id
                        }
                    }
                }
            })

            await transaction.backend_escrow.update({
                where:{
                    key: labReport.id 
                },
                update:{
                    secretKey: secretKey,
                    secretVI: secretVI
                }
            })

            return labReport
        })
        

        

        await transaction.commit();

        return res.send({...labReport, data: labReportDataFinal });


    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({message: error.message});
    }
}


module.exports.deleteLabReport = async(req,res) => {
    try {
        const { labReportId } = req.body;
        
        const labReport = await prisma.$transaction(async(transaction) => {
            const labReportData = await transaction.lab_report.delete({
                where:{
                    id: labReportId
                }
            });

            await transaction.backend_escrow.delete({
                where: {
                    key: labReportId
                }
            })

            return labReportData
        })

        return res.send(labReport);

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}






