import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";

const app = express()
app.use(cors())
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

const { 
  manageDesigns, firstBatchDesigns, moreDesigns, getSingleDesign
 } = require('./handlers/designs');

 app.post("/manageDesigns/:queryType", manageDesigns);
 app.get("/firstBatchDesigns/:userId", firstBatchDesigns);
 app.get("/moreDesigns/:userId/:lastDesignId", moreDesigns);
 app.get("/getSingleDesign/:userId/:designId", getSingleDesign);

exports.api = functions.region('europe-west2').https.onRequest(app);
