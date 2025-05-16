import { MongoClient } from 'mongodb';

if (!import.meta.env.VITE_MONGODB_URI) {
  throw new Error('Missing MongoDB URI');
}

const client = new MongoClient(import.meta.env.VITE_MONGODB_URI);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('taskflow');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log('Closed MongoDB connection');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}