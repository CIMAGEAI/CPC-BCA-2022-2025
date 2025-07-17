// All imports are now consistently v2
const {onDocumentCreated, onDocumentDeleted} = require("firebase-functions/v2/firestore");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const vision = require("@google-cloud/vision");

admin.initializeApp();

// ✅ ADDED: Lazy initializer for the Vision AI client
let visionClient;
const getVisionClient = () => {
  if (!visionClient) {
    visionClient = new vision.ImageAnnotatorClient();
  }
  return visionClient;
};

// Lazy Initializer for Nodemailer
let mailTransport;
const getMailTransport = () => {
  if (!mailTransport) {
    const gmailEmail = process.env.GMAIL_EMAIL;
    const gmailPassword = process.env.GMAIL_PASSWORD;

    mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    });
  }
  return mailTransport;
};


const ADMIN_EMAIL = "kislay_ankit@yahoo.com";
const ROOT_ADMIN_EMAIL = "kislayjha844@gmail.com";

// --- All functions are now consistently v2 ---

exports.sendContactMessage = onDocumentCreated(
    "contacts/{contactId}",
    async (event) => {
      const newContact = event.data.data();
      const gmailEmail = process.env.GMAIL_EMAIL;

      const adminMailOptions = {
        from: `Contact Form <${gmailEmail}>`,
        to: `${ADMIN_EMAIL}, ${ROOT_ADMIN_EMAIL}`,
        subject: "New Contact Form Submission",
        html: `
        <p>You have a new contact form submission:</p>
        <ul>
          <li><strong>Name:</strong> ${newContact.name}</li>
          <li><strong>Email:</strong> ${newContact.email}</li>
          <li><strong>Message:</strong> ${newContact.message}</li>
        </ul>
      `,
      };

      const userMailOptions = {
        from: `NavShayKriti <${gmailEmail}>`,
        to: newContact.email,
        subject: "We've Received Your Message!",
        html: `
        <p>Hi ${newContact.name},</p>
        <p>Thank you for contacting us. We have received your message
        and will get back to you shortly.</p>
        <p>Best regards,<br/>The Team</p>
      `,
      };

      try {
        const transport = getMailTransport();
        await transport.sendMail(adminMailOptions);
        logger.log("New contact email sent to admins.");
        await transport.sendMail(userMailOptions);
        logger.log("Confirmation email sent to user.");
      } catch (error) {
        logger.error("Failed to send contact emails:", error);
      }
    },
);

exports.sendWelcomeEmail = onDocumentCreated("users/{userId}", async (event) => {
  const user = event.data.data();
  const userEmail = user.email;
  const gmailEmail = process.env.GMAIL_EMAIL;

  if (user.provider !== "email") {
    logger.log(
        `Skipping welcome for ${userEmail} (provider: ${user.provider})`,
    );
    return;
  }

  const welcomeMailOptions = {
    from: `NavShayKriti <${gmailEmail}>`,
    to: userEmail,
    subject: "Welcome to NavShayKriti! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome aboard, ${user.displayName || "Friend"}!</h2>
        <p>
          Thank you for registering with NavShayKriti.
          We're thrilled to have you.
        </p>
        <p>You can now log in to your account and start exploring.</p>
        <br>
        <p>Best regards,</p>
        <p><b>The NavShayKriti Team</b></p>
      </div>
    `,
  };

  try {
    const transport = getMailTransport();
    await transport.sendMail(welcomeMailOptions);
    logger.log(`Welcome email sent successfully to ${userEmail}`);
  } catch (error) {
    logger.error(`Welcome email failed for ${userEmail}:`, error);
  }
});

exports.sendRegistrationOtp = onCall(async (request) => {
  const userEmail = request.data.email;
  const gmailEmail = process.env.GMAIL_EMAIL;
  if (!userEmail) {
    throw new HttpsError(
        "invalid-argument", "The function must be called with an email.",
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiration = admin.firestore.Timestamp.now().toMillis() + 10 * 60 * 1000;

  const otpDocRef = admin.firestore().collection("otps").doc(userEmail);
  await otpDocRef.set({
    otp: otp,
    expiresAt: expiration,
  });

  const otpMailOptions = {
    from: `NavShayKriti Security <${gmailEmail}>`,
    to: userEmail,
    subject: "Your NavShayKriti Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your Verification Code</h2>
        <p>
          Please use the following code to complete your registration.
          This code is valid for 10 minutes.
        </p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">
          ${otp}
        </p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>Thanks,</p>
        <p><b>The NavShayKriti Team</b></p>
      </div>
    `,
  };

  try {
    const transport = getMailTransport();
    await transport.sendMail(otpMailOptions);
    logger.log(`OTP sent successfully to ${userEmail}`);
    return {success: true, message: "OTP sent successfully."};
  } catch (error) {
    logger.error(`Failed to send OTP to ${userEmail}:`, error);
    throw new HttpsError("internal", "Failed to send OTP email.");
  }
});

exports.verifyRegistrationOtp = onCall(async (request) => {
  const {email, otp} = request.data;
  if (!email || !otp) {
    throw new HttpsError(
        "invalid-argument",
        "Email and OTP must be provided.",
    );
  }

  const otpDocRef = admin.firestore().collection("otps").doc(email);
  const otpDoc = await otpDocRef.get();

  if (!otpDoc.exists) {
    throw new HttpsError(
        "not-found",
        "Invalid OTP or email. Please try again.",
    );
  }

  const {otp: storedOtp, expiresAt} = otpDoc.data();

  if (expiresAt < admin.firestore.Timestamp.now().toMillis()) {
    await otpDocRef.delete();
    throw new HttpsError(
        "deadline-exceeded",
        "The OTP has expired. Please request a new one.",
    );
  }

  if (storedOtp !== otp) {
    throw new HttpsError("unauthenticated", "The OTP is incorrect.");
  }

  await otpDocRef.delete();
  return {success: true, message: "OTP verified successfully."};
});

exports.onUserDeleted = onDocumentDeleted("users/{userId}", async (event) => {
  const userId = event.params.userId;
  logger.log(`User document deleted for UID: ${userId}. Deleting from Auth.`);

  try {
    await admin.auth().deleteUser(userId);
    logger.log(`Successfully deleted user ${userId} from Firebase Auth.`);
  } catch (error) {
    logger.error(`Error deleting user ${userId} from Firebase Auth:`, error);
  }
});

exports.checkIfEmailExists = onCall(async (request) => {
  const email = request.data.email;
  if (!email) {
    throw new HttpsError(
        "invalid-argument",
        "The function must be called with an email.",
    );
  }

  try {
    await admin.auth().getUserByEmail(email);
    return {exists: true};
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return {exists: false};
    }
    throw new HttpsError("internal", error.message);
  }
});


exports.searchWithImage = onCall({
  region: "us-central1",
  timeoutSeconds: 120,
}, async (request) => {
  // NOTE: The authentication check is removed for public access.
  const imageUrl = request.data.imageUrl;
  if (!imageUrl) {
    throw new HttpsError("invalid-argument", "Missing image URL.");
  }

  logger.log("Analyzing image URL:", imageUrl);

  try {
    const client = getVisionClient();
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations.map((label) => label.description.toLowerCase());

    if (labels.length === 0) {
      return {products: []};
    }

    const productsRef = admin.firestore().collection("products");
    const querySnapshot = await productsRef
        .where("tags", "array-contains-any", labels)
        .limit(10)
        .get();

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({id: doc.id, ...doc.data()});
    });

    return {products: products};
  } catch (error) {
    logger.error("ERROR during visual search:", error);
    throw new HttpsError("internal", "Failed to perform visual search.");
  }
});
