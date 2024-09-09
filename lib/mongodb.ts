import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, defina a variável de ambiente MONGODB_URI no arquivo .env.local'
  );
}

// Crie uma interface para armazenar a conexão e a promessa de conexão
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use um objeto global para armazenar a conexão e a promessa
const globalCache: MongooseCache = {
  conn: null,
  promise: null,
};

async function connectMongo() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const opts: mongoose.ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    globalCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export default connectMongo;