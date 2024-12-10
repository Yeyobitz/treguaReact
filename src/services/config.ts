import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CONFIG_DOC = 'restaurant_config';

export async function getConfig() {
  const docRef = doc(db, 'config', CONFIG_DOC);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  
  return null;
}

export async function updateConfig(data: any) {
  const docRef = doc(db, 'config', CONFIG_DOC);
  await setDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}