const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../_secure/index.js");


const ageCalculator = (dob) => {
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}



module.exports.geTotalNumberOfMedicalCases =  async(req,res) => {
    try {
        const totalNumberOfMedicalCases = await prisma.$queryRaw`SELECT COUNT(*) FROM (SELECT "public"."medical_case"."id" FROM "public"."medical_case" WHERE 1=1 OFFSET 0) AS "sub"`
        return res.send({totalNumberOfMedicalCases: Number.parseInt(totalNumberOfMedicalCases[0].count)});
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}


module.exports.getTotalNumberOfUsers = async(req,res) => {
    try {
        const totalNumberOfUsers = await prisma.$queryRaw`SELECT COUNT(*) FROM (SELECT "public"."user"."id" FROM "public"."user" WHERE 1=1 OFFSET 0) AS "sub"`
        return res.send({totalNumberOfUsers: Number.parseInt(totalNumberOfUsers[0].count)});

    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}


module.exports.createMedicalCaseData = async (req, res) => {
    let medicalCaseData;
    try {
      const { medicalRecordData, patientVpa, doctorId, hospitalId } = req.body;

      console.log(patientVpa)
  
      const visit = await prisma.$transaction(async (transaction) => {

        // const pvData2 = await transaction.$queryRaw`SELECT * FROM "user_vpa" INNER JOIN "user" ON "user_vpa"."userId" = "user"."id" LEFT JOIN "user_metadata" ON "user"."id" = "user_metadata"."userId" WHERE "user_vpa"."vpa" = ${patientVpa};`;
        
        // console.log(pvData2);

        // -> Retrieve Patient Metadata, Userdata and VPA Data
        let userVPA = (await transaction.$queryRaw`SELECT * FROM "user_vpa" WHERE "user_vpa"."vpa" = ${patientVpa+"@uhi"};`)[0];
        
        let user = (await transaction.$queryRaw`SELECT * FROM "user" WHERE "user"."id" = ${userVPA.userId};`)[0];
        let userMetadata = (await transaction.$queryRaw`SELECT * FROM "user_metadata" WHERE "user_metadata"."userId" = ${userVPA.userId};`)[0];
        let patinet = (await transaction.$queryRaw`SELECT * FROM "patient" WHERE "patient"."userId" = ${userVPA.userId};`)[0];
        console.log(patinet)
        let pvData = {
            ...userVPA,
            user: {
                ...user,
                user_metadata: {
                    ...userMetadata
                }
            }
        }


  
        // -> Create Medical Case Data with Patient Metadata
        if(medicalRecordData){
            medicalCaseData = medicalRecordData
        }else{
            medicalCaseData = {
            patientName: pvData.user.name,
            patientVpa: pvData.vpa,
            vitalSignature:{
                dob: pvData.user.user_metadata.dob,
                weight: 0,
                height: 0,
                bmi: 0,
                age: ageCalculator(pvData.user.user_metadata.dateOfBirth),
            }
        };
    }   
  
        // -> Encrypt Medical Case Data
        const { cipher, secretKey, secretVI } =
          _secure.encryption.encryptData(JSON.stringify(medicalCaseData));
  
        // -> Store Medical Case Data in Medical Case Table
        // -> Store Secret Key in Backend Escrow Table

        
        let medicalCase = (await transaction.$queryRaw`INSERT INTO "medical_case" ("id", "createdAt", "updatedAt", "data", "patientId") VALUES (${uuidv4()}, ${new Date()}, ${new Date()}, ${cipher}, ${patinet.id}) RETURNING *;`)[0];
        console.log("MC", medicalCase)
        let visit = (await transaction.$queryRaw`INSERT INTO "visits" ("id", "createdAt", "updatedAt", "medicalCaseId") VALUES (${uuidv4()}, ${new Date()}, ${new Date()}, ${medicalCase.id}) RETURNING *;`)[0];

        let doctor_visits = (await transaction.$queryRaw`INSERT INTO "doctor_visits" ("createdAt", "updatedAt", "doctorId", "visitId") VALUES ( ${new Date()}, ${new Date()}, ${doctorId}, ${visit.id}) RETURNING *;`)[0];
        
        let medicalCaseHospital = (await transaction.$queryRaw`INSERT INTO "medical_case_hospital" ("createdAt", "updatedAt", "hospitalId", "medicalCaseId") VALUES (${new Date()}, ${new Date()}, ${hospitalId}, ${medicalCase.id}) RETURNING *;`)[0];


        let hospital = (await transaction.$queryRaw`SELECT * FROM "hospital" WHERE "hospital"."id" = ${hospitalId};`)[0];

        visit = {
            ...visit,
            doctor_visits: {
                ...doctor_visits
            },
            medical_case: {
                ...medicalCase,
                medical_case_hospital: {
                    ...medicalCaseHospital,
                    hospital:{
                        ...hospital
                    },
                }
            }
        }
        await prisma.backend_escrow.create({
          data: {
            key: visit.medicalCaseId,
            secretKey: secretKey,
            secretVI: secretVI,
          }
        });
  
        return visit;
      });
  
      return res.send({ ...visit, medical_case: { ...visit.medical_case, data: medicalCaseData } });
    } catch (error) {
        console.log(error)
      return res.status(500).send({ message: error.message });
    }
};

module.exports.updateMedicalCaseData = async(req,res) => {
    let updatedData;
    try {
        const { data, medicalCaseid, hospitalId } = req.body;
        // const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(data));

        const updatedDataX = await prisma.$transaction(async (transaction) => {
            // Get Old Medical Case Data
            // const getMedicalCase = await transaction.medical_case.findUnique({
            //     where:{
            //         id: medicalCaseid
            //     }
            // });

            const getMedicalCase = (await transaction.$queryRaw`SELECT * FROM "medical_case" WHERE "medical_case"."id" = ${medicalCaseid};`)[0];

            const getSecretKey = (await transaction.$queryRaw`SELECT * FROM "backend_escrow" WHERE "backend_escrow"."key" = ${medicalCaseid};`)[0];

            // Get Old Secret Key
            // const getSecretKey = await transaction.backend_escrow.findUnique({
            //     where:{
            //         key: getMedicalCase.id
            //     }
            // });

            // Decrypt Old Medical Case Data
            const decryptData = _secure.decryption.decryptData(getMedicalCase.data, getSecretKey.secretKey, getSecretKey.secretVI);

            // Update Medical Case Data
            updatedData = {...JSON.parse(decryptData), ...data};

            // Encrypt New Medical Case Data
            const { cipher, secretKey, secretVI } = _secure.encryption.encryptData(JSON.stringify(updatedData));

            // Update Medical Case Data
            // const x = await transaction.medical_case.update({
            //     where:{
            //         id: getMedicalCase.id
            //     },
            //     data:{
            //         data: cipher,
            //     }
            // });

            const x = (await transaction.$queryRaw`UPDATE "medical_case" SET "data" = ${cipher} WHERE "medical_case"."id" = ${getMedicalCase.id} RETURNING *;`)[0];

            //Update Secret Key
            await transaction.backend_escrow.update({
                where:{
                    id: getSecretKey.id
                },
                data:{
                    secretKey: secretKey,
                    secretVI: secretVI
                }
            });

            

            return x;
        });

        return res.send({...updatedDataX, data: updatedData});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.getMedicalCaseData = async(req,res) => {
    try {
        const { medicalCaseId } = req.params;
        const secretKeyData = (await prisma.$queryRaw`SELECT * FROM backend_escrow WHERE key = ${medicalCaseId};`)[0]

        const medicalCase = (await prisma.$queryRaw`SELECT * FROM medical_case WHERE id = ${medicalCaseId};`)[0]

        const decryptData = _secure.decryption.decryptData(medicalCase.data, secretKeyData.secretKey, secretKeyData.secretVI);


        return res.send({ ...medicalCase,  data: JSON.parse(decryptData)});

    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.deleteMedicalCase = async(req,res) => {
    try {
        const { medicalCaseId } = req.body;
        console.log("From f", medicalCaseId)

        const deletedData = await prisma.$transaction(async (transaction) => {
         
            // Delete Medical Case
            const deleteMedicalCase = await transaction.medical_case.delete({
                where: {
                    id: medicalCaseId
                }
            });

            // Delete Secret Key
            await transaction.backend_escrow.delete({
                where: {
                    key: medicalCaseId
                }
            });

            return deleteMedicalCase;
        });

        return res.send({...deletedData, message:"Medical History Deleted"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
}

module.exports.createLabReport = async(req,res) => {

    const transaction = await prisma.$transaction();
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
        // -> Save the Lab Report Data to the Medical Case Table



        // -> Get Medical Case Data Secret Keys
        const medicalCaseSecretKey = await prisma.backend_escrow.findUnique({
            where:{
                key: medicalCaseid
            }
        },transaction);
         

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
        },transaction);


        // -> Get User Metadata (Contains Birthdate)
        const { dateOfBirth } = getMedicalCase.patient.user.user_metadata;
        

        // -> Decrypt Medical Case Data (Contains Weight and Height of the User)
        const decryptMedicalCaseData = _secure.decryption.decryptData(JSON.stringify(getMedicalCase.data), medicalCaseSecretKey.secretKey, medicalCaseSecretKey.secretVI);


        const { weight, height } = decryptMedicalCaseData;

        const labReportDataFinal = { ...labReportData, bmi: weight / (height * height), dateOfBirth: dateOfBirth,age: ageCalculator(dateOfBirth) , patientName: getMedicalCase.patient.user.name, patientVpa: getMedicalCase.patient.user.user_vpa.vpa };

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
        }, transaction)

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
        }, transaction)

        await transaction.commit();

        return res.send({message: "Lab Report Created", labReport: { ...labReport, data: labReportDataFinal }});


    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({message: error.message});
    }
}



module.exports.searchMedicalCaseByVPA = async(req,res) => {
    try {
        const { vpa } = req.body;
        const medicalCases = await prisma.$queryRaw`select medical_case.* , uv.vpa from "medical_case" inner join patient on medical_case."patientId" = patient.id inner join "user" u on patient."userId" = u.id inner join user_vpa uv on u.id = uv."userId" where uv.vpa = ${vpa};`
        // console.log(medicalCases);
        return res.send(medicalCases);
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}





