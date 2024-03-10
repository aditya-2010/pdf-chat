import admin, { ServiceAccount } from "firebase-admin";

const sA: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY as string,
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL as string,
};

export function firebaseAdminInit() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(sA),
    });
  }
}
