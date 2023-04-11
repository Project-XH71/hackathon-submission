const prisma = require("../../../primsaInit.js");
const { v4: uuidv4 } = require('uuid');
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const _secure = require("../../_secure");

module.exports.createHospital = async(req,res) => {
  try {
    const { name, lang, long,   } 
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
}

