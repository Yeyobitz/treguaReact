import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account from environment or file
const serviceAccountPath = join(__dirname, '../../private_key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

async function createOrUpdateAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('Admin email and password must be provided in environment variables');
    }

    let user;
    try {
      // Try to get existing user
      user = await auth.getUserByEmail(email);
      console.log('Existing admin user found');
    } catch (error) {
      // If user doesn't exist, create new one
      if (error.code === 'auth/user-not-found') {
        user = await auth.createUser({
          email,
          password,
          emailVerified: true,
        });
        console.log('New admin user created');
      } else {
        throw error;
      }
    }

    // Create or update user document in Firestore
    await db.collection('users').doc(user.uid).set({
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    }, { merge: true });

    // Set custom claims
    await auth.setCustomUserClaims(user.uid, { role: 'admin' });

    console.log('Admin user setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createOrUpdateAdmin();