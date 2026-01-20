// src/utils/createAdmin.js
// One-time setup script to create admin account

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../backend/firebase/config';

/**
 * Creates an admin account with predefined credentials
 * Email: onlyinstrumentals365@gmail.com
 * Password: admin123
 * Username: admin
 * Role: admin
 */
export const createAdminAccount = async () => {
  const adminEmail = 'onlyinstrumentals365@gmail.com';
  const adminPassword = 'admin123';
  const adminUsername = 'admin';

  try {
    console.log('🔄 Creating admin account...');
    console.log('Email:', adminEmail);

    // Check if account already exists
    try {
      const existingUser = await getDoc(doc(db, 'users', auth.currentUser?.uid));
      if (existingUser.exists() && existingUser.data().email === adminEmail) {
        console.log('⚠️ Admin account already exists');
        return { 
          success: false, 
          error: 'Admin account already exists',
          existing: true 
        };
      }
    } catch (e) {
      // No current user, proceed with creation
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );
    const user = userCredential.user;
    console.log('✅ Firebase Auth user created:', user.uid);

    // Update Firebase Auth profile with username
    await updateProfile(user, { displayName: adminUsername });
    console.log('✅ Profile updated with username');

    // Create Firestore document with admin role
    const adminData = {
      // Auth Info
      uid: user.uid,
      email: adminEmail,
      username: adminUsername,
      role: 'admin', // ← ADMIN ROLE!
      
      // Profile Info
      name: 'Administrator',
      profilePicture: null,
      
      // Game Stats
      xp: 0,
      level: 1,
      rank: 'Bronze I',
      badge: 'Bronze I',
      
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
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), adminData);
    console.log('✅ Firestore document created with admin role');

    // Verify document was created
    const verifyDoc = await getDoc(doc(db, 'users', user.uid));
    if (verifyDoc.exists()) {
      const data = verifyDoc.data();
      console.log('✅ Admin account verified in Firestore');
      console.log('Role:', data.role);
      console.log('Username:', data.username);
    }

    console.log('🎉 Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Username:', adminUsername);
    console.log('🛡️ Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { 
      success: true, 
      user,
      credentials: {
        email: adminEmail,
        password: adminPassword,
        username: adminUsername,
        role: 'admin'
      }
    };
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ Email already in use. Admin account may already exist.');
      console.log('💡 Try logging in with the credentials or check Firestore for the role.');
      return { 
        success: false, 
        error: 'Email already in use - account may already exist',
        code: error.code
      };
    }
    
    if (error.code === 'auth/weak-password') {
      console.log('⚠️ Password too weak. Using stronger password...');
      return { 
        success: false, 
        error: 'Password too weak',
        code: error.code
      };
    }

    return { 
      success: false, 
      error: error.message,
      code: error.code
    };
  }
};

/**
 * Promotes an existing user to admin role
 * @param {string} userId - Firebase user UID
 */
export const promoteToAdmin = async (userId) => {
  try {
    console.log('🔄 Promoting user to admin:', userId);

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error('❌ User not found');
      return { success: false, error: 'User not found' };
    }

    await setDoc(userRef, { role: 'admin' }, { merge: true });
    console.log('✅ User promoted to admin');

    return { success: true };
  } catch (error) {
    console.error('❌ Error promoting user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Checks if admin account exists
 */
export const checkAdminExists = async () => {
  try {
    const adminEmail = 'onlyinstrumentals365@gmail.com';
    
    // This is a simple check - in production you'd query Firestore
    console.log('🔍 Checking if admin exists...');
    console.log('Expected email:', adminEmail);
    console.log('💡 Check Firebase Console → Firestore → users collection');
    
    return { checked: true };
  } catch (error) {
    console.error('Error checking admin:', error);
    return { checked: false, error: error.message };
  }
};