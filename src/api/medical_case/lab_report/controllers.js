const prisma = require("../../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../../_secure");

const ageCalculator = (dob) => {
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}


module.exports.createLabReport = async(req,res) => {

    let labReportDataFinal;
    try {
        const { medicalCaseId, labReportData } = req.body;

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
            const medicalCaseSecretKey = await transaction.backend_escrow.findUnique({
                where:{
                    key: medicalCaseId
                }
            });
            
            // -> Get Medical Case Data
            const getMedicalCase = await transaction.medical_case.findUnique({
                where:{
                    id: medicalCaseId
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

            labReportDataFinal = {  
                patientName: getMedicalCase.patient.user.name, 
                patientVpa: getMedicalCase.patient.user.user_vpa.vpa,
                vitalSignature:{
                    bmi: weight / (height * height), 
                    dateOfBirth: dateOfBirth,age: ageCalculator(dateOfBirth) , 
                },
                data:{
                    ...labReportData
                }
            };

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

            
            await transaction.backend_escrow.upsert({
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

        return res.send({...labReport, data: labReportDataFinal });


    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.getLabReport = async(req,res) => {
    try {
        const { id } = req.params;

        const secretKeyData = await prisma.backend_escrow.findUnique({
            where:{
                key: id
            }
        });

        

        const labReport = await prisma.lab_report.findUnique({
            where:{
                id: id
            }
        });
        
        const decryptData = _secure.decryption.decryptData(labReport.data, secretKeyData.secretKey, secretKeyData.secretVI);


        return res.send({ ...labReport,  data: JSON.parse(decryptData)});

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}


module.exports.updateLabReport = async(req,res) => {

    let labReportDataFinal;
    try {
        const { labCaseId, labReportData } = req.body;


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
                    key: labCaseId
                }
            });
            

            // -> Get Medical Case Data
            const getMedicalCase = await transaction.lab_report.findUnique({
                where:{
                    id: labCaseId
                }
            });


            
            

            // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
            const decryptMedicalCaseData = _secure.decryption.decryptData(getMedicalCase.data, medicalCaseSecretKey.secretKey, medicalCaseSecretKey.secretVI);
            const oldDataX = JSON.parse(decryptMedicalCaseData);
            labReportDataFinal = { ...oldDataX, data: {...oldDataX.data, ...labReportData.data}};

            const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(labReportDataFinal));

            const labReport = await transaction.lab_report.update({
                where:{
                    id: labCaseId
                },
                data:{
                    data: cipher
                }
            })

            await transaction.backend_escrow.update({
                where:{
                    key: labReport.id 
                },
                data:{
                    secretKey: secretKey,
                    secretVI: secretVI
                }
            })

            return labReport
        })
        

        return res.send(labReport);


    } catch (error) {
        console.log(error)
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


module.exports.getMultipleLabReports = async(req,res) => {
    try {
        const { hospitalId, filter } = req.body;
        console.log(hospitalId, filter)
        const labReports = await prisma.$transaction(async(transaction) => {
            let labReportData = null;
            if(filter === 'hospital-all'){
                labReportData = await transaction.lab_report.findMany({
                    where:{
                        medical_case:{
                            medical_case_hospital:{
                                every:{
                                    hospitalId: hospitalId
                                }
                            }
                        }
                    },
                    select:{
                        id: true,
                        createdAt: true,
                        medical_case:{
                            select:{
                                patient:{
                                    select:{
                                        user:{
                                            select:{
                                                name: true,
                                                user_vpa:{
                                                    select:{
                                                        vpa: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }

            return labReportData
        })

        return res.send(labReports);

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}
