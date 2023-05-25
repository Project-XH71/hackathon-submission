const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });

// prisma.$on("query", async (e) => {
//     console.log(`--------------------------------`)
//     console.log(`QUERY:-> ${e.query}`)
//     console.log(`PARAMS:-> ${e.params}`)
//     console.log(`--------------------------------`)
// });

module.exports = prisma;