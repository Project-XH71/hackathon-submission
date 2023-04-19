const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const UserRoles = require("supertokens-node/recipe/userroles");

const { v4: uuidv4 } = require('uuid');

const _secure = require("../_secure");

const prisma = require("../../primsaInit");

module.exports.update = async (req, res) => {
    let userId = req.session.getUserId();
    const { updatedData } = req.body;
    // const user = await prisma.user.update({
    //     where:{
    //         id: userId
    //     },
    //     data:{
    //         ...updatedData
    //     }
    // })

    
    await UserMetadata.updateUserMetadata(userId, {name: updatedData.name})
    
    return res.status(200).send(user);
};



module.exports.info = async(req,res) => {
    const userId = req.session.getUserId();

    // const user = await prisma.$queryRaw`SELECT * FROM "user" WHERE id = ${userId} JOIN "user_metadata" ON "user_metadata"."userId" = "user"."id"`;

    const user = await prisma.$transaction(async (tx) => {
        let useralpha = await prisma.$queryRaw`SELECT "public"."user"."id", "public"."user"."email", "public"."user"."name", "public"."user"."createdAt", "public"."user"."updatedAt" FROM "public"."user" WHERE ("public"."user"."id" = ${userId} AND 1=1) LIMIT 1 OFFSET 0`
        let userbeta = await prisma.$queryRaw`SELECT "public"."user_metadata"."id", "public"."user_metadata"."userId", "public"."user_metadata"."phoneNumber", "public"."user_metadata"."dateOfBirth", "public"."user_metadata"."createdAt", "public"."user_metadata"."updatedAt", "public"."user_metadata"."address" FROM "public"."user_metadata" WHERE "public"."user_metadata"."userId" IN (${userId}) OFFSET 0`
        return {
            ...useralpha[0],
            metadata: userbeta[0]
        }
    })
    const auth = await UserMetadata.getUserMetadata(userId)

    return res.status(200).send({user: user,auth});
}

module.exports.updateUserMetadata = async(req,res) => {
    try {
        const { phoneNumber, dateOfBirth, address } = req.body;

        const userMetadata = await prisma.$executeRaw`UPDATE "user_metadata" SET "phoneNumber" = ${phoneNumber}, "dateOfBirth" = ${new Date(dateOfBirth)}, "address" = ${address} WHERE "userId" = ${req.session.getUserId()} RETURNING "userId"`;
        
        return res.status(200).send({...userMetadata});


    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}

module.exports.getUserRoles = async(req,res) => {
    try {
        const userId = req.session.getUserId();
        const roles = await UserRoles.getRolesForUser(userId);
        return res.status(200).send(roles);
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}