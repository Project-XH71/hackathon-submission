require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const supertokens = require("supertokens-node");
const { middleware, errorHandler } = require("supertokens-node/framework/express");
const middlewares = require('./middlewares');

const app = express();

supertokens.init(require("./config/supertoken"));

app.use(express.json());
// app.use(cors())
const whitelist = ["http://localhost:5173, http://192.168.29.243:5173"]
app.use(
  cors({
      origin: process.env.SUPERTOKENS_CONNECTION_WEBSITE_DOMAIN,
      allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders(),"anti-csrf", "rid", "fdi-version", "authorization", "st-auth-mode", "Origin, X-Requested-With, Content-Type, Accept, Authorization"],
      methods: ["GET", "PUT", "POST", "DELETE", "PATCH","PUT"],
      credentials: true,
      // origin: true,
  })
);
app.disable('etag');
// This exposes all the APIs from SuperTokens to the client.
app.use(middleware());

app.use(morgan('dev'));
app.use(helmet());



app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send(err);
})

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use("/user", require("./api/user/route"));
app.use("/admin", require("./api/admin/route"));
// app.use("/group", require("./api/group/route"));
// app.use("/query", require("./api/query/index"));
// app.use("/aws/benchmark", require("./api/aws/benchmark.route.js"));
app.use("/vpa",require("./api/vpa/routes.js"));
app.use("/patient",require("./api/patient/routes.js"));
app.use("/medical-case",require("./api/medical_case/routes.js"));
app.use("/hospital",require("./api/hospital/routes.js"));
app.use("/appointment",require("./api/appointment/routes.js"));


app.use("/v2/user", require("./api/user_v2/route.js"));
app.use("/medical_case", require("./api/medical_case/routes.js"));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;