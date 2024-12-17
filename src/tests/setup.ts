import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn()
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  enableIndexedDbPersistence: vi.fn().mockResolvedValue(undefined)
}));

// Mock de servicios de notificación
vi.mock('../services/notifications/smsService', () => ({
  smsService: {
    sendCustomerSMS: vi.fn(),
    sendAdminSMS: vi.fn()
  }
}));

vi.mock('../services/notifications/emailService', () => ({
  sendCustomerEmail: vi.fn(),
  sendAdminEmail: vi.fn()
}));

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  vi.clearAllMocks();
}); 