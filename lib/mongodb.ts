import mongoose from 'mongoose';

// Definição do tipo para o global
declare global {
  namespace NodeJS {
    interface Global {
      mongoose: { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null };
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, defina a variável de ambiente MONGODB_URI no arquivo .env.local'
  );
}

let cached = global.mongoose as { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongo;