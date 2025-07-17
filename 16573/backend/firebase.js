const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "coursesellingapp-fbf6a.appspot.com", // 🔁 match with your Firebase project
});

const bucket = admin.storage().bucket();

module.exports = bucket;
