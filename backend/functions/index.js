// functions/index.js - FIXED
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

// Set global options
setGlobalOptions({maxInstances: 10});

// Helper function to calculate level from XP
const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

// Helper function to calculate rank from XP
const calculateRank = (xp) => {
  if (xp >= 5000) return "Gold III";
  if (xp >= 4000) return "Gold II";
  if (xp >= 3000) return "Gold I";
  if (xp >= 2000) return "Silver III";
  if (xp >= 1500) return "Silver II";
  if (xp >= 1000) return "Silver I";
  if (xp >= 500) return "Bronze III";
  if (xp >= 250) return "Bronze II";
  return "Bronze I";
};

// For Auth triggers, we need to use v1 functions
const functions = require("firebase-functions");

// Trigger when a new user is created in Firebase Authentication
exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
  const {uid, email, displayName, photoURL} = user;

  console.log("🔄 Creating user document for:", uid);

  const initialXP = 0;

  const userData = {
    // Auth Info
    uid: uid,
    email: email || "",
    username: displayName || email?.split("@")[0] || "User",
    role: "user", // Default role

    // Profile Info
    name: displayName || email?.split("@")[0] || "User",
    profilePicture: photoURL || null,

    // Game Stats
    xp: initialXP,
    level: calculateLevel(initialXP),
    rank: calculateRank(initialXP),
    badge: "Bronze I",

    // Battle Stats
    wins: 0,
    losses: 0,
    totalBattles: 0,
    winRate: 0,
    streak: 0,

    // Collections
    achievements: [],
    badges: 0,
    friends: [],

    // Timestamps
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await admin.firestore()
        .collection("users")
        .doc(uid)
        .set(userData);

    console.log("✅ User document created successfully for:", uid);
    return {success: true};
  } catch (error) {
    console.error("❌ Error creating user document:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Delete user data when user account is deleted
exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
  const {uid} = user;

  try {
    await admin.firestore()
        .collection("users")
        .doc(uid)
        .delete();

    console.log("✅ User document deleted for:", uid);
    return {success: true};
  } catch (error) {
    console.error("❌ Error deleting user document:", error);
    return {success: false, error: error.message};
  }
});

// Callable function to make a user admin
exports.makeUserAdmin = functions.https.onCall(async (data, context) => {
  // Check if request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated.",
    );
  }

  // Check if caller is already an admin
  const callerDoc = await admin.firestore()
      .collection("users")
      .doc(context.auth.uid)
      .get();

  if (!callerDoc.exists || callerDoc.data().role !== "admin") {
    throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can make other users admin.",
    );
  }

  const {email} = data;

  if (!email) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Email is required.",
    );
  }

  try {
    // Find user by email
    const usersSnapshot = await admin.firestore()
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

    if (usersSnapshot.empty) {
      throw new functions.https.HttpsError(
          "not-found",
          "User not found with this email.",
      );
    }

    const userDoc = usersSnapshot.docs[0];

    // Update role to admin
    await admin.firestore()
        .collection("users")
        .doc(userDoc.id)
        .update({
          role: "admin",
        });

    console.log("✅ User made admin:", email);
    return {success: true, message: `${email} is now an admin.`};
  } catch (error) {
    console.error("❌ Error making user admin:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// HTTP function for health check
exports.healthCheck = onRequest(async (req, res) => {
  res.json({
    status: "ok",
    message: "SkillDuels Cloud Functions are running!",
    timestamp: new Date().toISOString(),
  });
});