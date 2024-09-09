import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Error: não foi encontrado a variavel de ambiente MONGODB_URI'
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const globalCache: MongooseCache = {
  conn: null,
  promise: null,
};

async function connectMongo() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export default connectMongo;