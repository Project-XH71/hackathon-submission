const prisma = require("../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');

module.exports.assignVpaToUser = async(req,res) => {
    try {
        const { vpaId } = req.body;
        const { userId } = req.session;
        const user_vpa = await prisma.user_vpa.upsert({
            where:{
                userId_vpa: {
                    userId: userId,
                    vpa: `${vpaId}@uhi`
                }
            },
            update: {},
            create: {
                id: uuidv4(),
                vpa: `${vpaId}@uhi`,
                user:{
                    connect:{
                        id: userId
                    }
                }
            },
            include:{
                user: true
            }
        })


        return res.status(201).send({...user_vpa})
    } catch (error) {
        throw error;
    }
}


module.exports.getVpa = async(req,res) => {
    try {
        const { userId } = req.session;
        const user_vpa = await prisma.user_vpa.findMany({
            where:{
                userId: userId
            },
            include:{
                user: true
            }
        })

        return res.status(200).send(user_vpa)
    } catch (error) {
        throw error;
    }
}