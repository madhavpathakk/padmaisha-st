const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC-WcysWf6ruJBzkZtphl6qbi7erhWU5wc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "padmaishastore.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "padmaishastore",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "padmaishastore.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "465490982451",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:465490982451:web:1a3da21f95eafb0949d546",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-RESERTDQL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteCollection(collectionName) {
  console.log(`Deleting ${collectionName}...`);
  const querySnapshot = await getDocs(collection(db, collectionName));
  const deletePromises = querySnapshot.docs.map(doc => 
    deleteDoc(doc.ref).then(() => console.log(`Deleted document ${doc.id} from ${collectionName}`))
  );
  await Promise.all(deletePromises);
  console.log(`Finished deleting ${collectionName}`);
}

async function cleanupDatabase() {
  try {
    // List of collections to delete
    const collections = ['users', 'orders', 'carts', 'products', 'analytics'];
    
    // Delete each collection
    for (const collectionName of collections) {
      await deleteCollection(collectionName);
    }
    
    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    process.exit();
  }
}

// Run the cleanup
cleanupDatabase();
