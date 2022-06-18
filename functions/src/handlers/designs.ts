import { ref, uploadString , getDownloadURL  } from "firebase/storage";
const { admin, db } = require("../utils/admin");
const { storage } = require("../utils/web");
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");
import { Request, Response } from "express";

//handle design creation and updates
exports.manageDesigns = (req: Request, res: Response) => {
  let imageB64File = req.body.image;
  const storageRef = ref(storage, `designs/${new Date().getTime()}`);

  let imageUploader = (file: string) => {
    return new Promise((resolve, reject) => {
      // Data URL string
      let uploadTask = uploadString(storageRef, file, "data_url");

      uploadTask.then((response: any) => 
        getDownloadURL(response.ref)
        .then(downLoadUrl => resolve(downLoadUrl))
      )
      .catch((err: any) => 
        reject({ error: "something went wrong" })
      )
    });
  };

  const designDetails = {
    title: req.body.title,
    createdAt: new Date().toISOString()
  };

  const designTimeRecords = {
    designedAt: [new Date().toISOString()],
  }

  const userRef = db
    .collection("designs")
    .doc(req.body.email)
    .collection("designDetails");

  imageUploader(imageB64File)
    .then(async (response) => {
      if (req.params.queryType === "create") {
        await userRef.add({ ...designDetails, ...designTimeRecords, designs: [response] });
        return res.json({ message: `Your design has been saved successfully` });
      } else {
        await userRef.doc(req.body.designId).update({
          title: designDetails.title,
          designs: admin.firestore.FieldValue.arrayUnion(response),
          designedAt: admin.firestore.FieldValue.arrayUnion(new Date().toISOString()),
        });
        return res.json({
          message: `Your design has been updated successfully`,
        });
      }
    })
    .catch((err: any) => {
      return res.json({ error: "something went wrong" })
  });
};

//get firstBatch of designs
exports.firstBatchDesigns = (req: Request, res: Response) => {
  //req.params.userId === userEmail
  let userRef = req.params.userId;

    async function queryDesigns(db: any) {
      const firstBatch = await db.collection('designs').doc(userRef)
      .collection('designDetails')
      .orderBy(`createdAt`, `desc`)
      .limit(5);
      return firstBatch.get();
    }
    queryDesigns(db)
      .then((snapshot) => {
        if(snapshot.docs.length === 0){
        return res.status(404).json({noDesign: 'No design has been created yet'});
        }
        let lastDocument = snapshot.docs[snapshot.docs.length - 1];
        lastDocument = lastDocument.data().createdAt;
        let designs = [lastDocument];
        snapshot.forEach((doc: any) => {
          designs.push({
            designId: doc.id,
            ...doc.data()
          });
        });
        return res.json(designs);
      })
      .catch((err) => {
        res.json({error: "couldn't get designs"})
      });
  }
//get subsequent batch of designs
exports.moreDesigns = (req: Request, res: Response) => {
  //req.params.userId === userEmail
  let userRef = req.params.userId;
  let lastDesignId = req.params.lastDesignId;
    async function queryDesigns(db: any) {
      const moreDesigns = db.collection('designs').doc(userRef)
      .collection('designDetails')
      .orderBy(`createdAt`, `desc`)
      .startAfter(lastDesignId)
      .limit(5);
      return moreDesigns.get();
    }
    queryDesigns(db)
      .then((snapshot) => {
        if(snapshot.docs.length === 0){
          return res.status(404).json({noMoreDesign: `That's all for now!`});
          }
        let lastDocument = snapshot.docs[snapshot.docs.length - 1];
        lastDocument = lastDocument.data().createdAt;
        let designs = [lastDocument];
        snapshot.forEach((doc: any) => {
          designs.push({
            designId: doc.id,
            ...doc.data()
          });
        });
        return res.json(designs);
      })
      .catch((err) => res.json({error: "couldn't get items"}));
  }

  //get individual product
  exports.getSingleDesign = (req: Request, res: Response) => {
    let email = req.params.userId;
    let designId = req.params.designId;
    db
    .collection("designs")
    .doc(email)
    .collection("designDetails")
    .doc(designId)
    .get()
    .then((doc: any) => {
      if(!doc.exists){
        return res.status(404).json({error: 'design not found'});
      }
      let designData = {
            email: email,
            designId: doc.id,
        ...doc.data()
      };
      return res.json(designData);
    })
    .catch((err: any) => {
      res.status(500).json({error: "couldn't get design"});
    })
  };