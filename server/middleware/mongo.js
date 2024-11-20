import { MongoClient } from 'mongodb';


let clientPromise;

async function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    clientPromise = client.connect();
    console.log('Connecting to mongo...');
  }
  try {
    return await clientPromise;
  } catch (error) {
    console.error('MongoDB connection failed. Retrying...', error.message);
    clientPromise = null; // Reset the client promise to retry
    return getClient();   // Retry connection
  }
}

export default defineEventHandler(async (event) => {
  const client = await getClient();
  event.context.mongo = client.db('saferTimes');
});