import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CreateDishDTO, Dish } from '../types/dish';

const COLLECTION = 'dishes';

export async function createDish(data: CreateDishDTO) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating dish:', error);
    throw new Error('Error al crear el plato');
  }
}

export async function getDishes() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Dish[];
  } catch (error) {
    console.error('Error getting dishes:', error);
    throw new Error('Error al obtener los platos');
  }
}

export async function updateDish(id: string, data: Partial<CreateDishDTO>) {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    throw new Error('Error al actualizar el plato');
  }
}

export async function deleteDish(id: string) {
  try {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Error al eliminar el plato');
  }
}