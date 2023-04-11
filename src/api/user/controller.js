const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const { v4: uuidv4 } = require('uuid');

const _secure = require("../_secure");

const prisma = require("../../primsaInit");

module.exports.update = async (req, res) => {
    let userId = req.session.getUserId();
    const { updatedData } = req.body;
    const user = await prisma.user.update({
        where:{
            id: userId
        },
        data:{
            ...updatedData
        }
    })
    await UserMetadata.updateUserMetadata(userId, {name: updatedData.name})
    
    return res.status(200).send(user);
};



module.exports.info = async(req,res) => {
    const userId = req.session.getUserId();
    const user = await prisma.user.findUnique({
        where:{
            id: userId
        }
    });

    const auth = await UserMetadata.getUserMetadata(userId)

    return res.status(200).send({user,auth});
}

module.exports.updateUserMetadata = async(req,res) => {
    try {
        const { phoneNumber, dateOfBirth, address } = req.body;
        
        const userMetadata = await prisma.user_metadata.upsert({
            where:{
                userId: req.session.getUserId()
            },
            update:{
                address,
                dateOfBirth: new Date(dateOfBirth),
                phoneNumber
            },
            create:{
                userId: req.session.getUserId(),
                address,
                dateOfBirth: new Date(dateOfBirth), 
                phoneNumber
            },
            include:{
                user: true
            }
        })

        return res.send(userMetadata);


    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}