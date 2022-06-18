//node admin sdk
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


// export default {admin, db};
module.exports = {admin, db};