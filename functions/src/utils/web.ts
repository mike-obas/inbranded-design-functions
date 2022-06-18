//web firebase sdk
const config = require('./config');
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseApp = initializeApp(config);
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);

//export default { firebase };
module.exports = {storage};