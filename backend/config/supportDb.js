import mongoose from 'mongoose';

// Separate connection for the supportai database (context storage)
const supportConn = mongoose.createConnection(process.env.MONGO_URI_SUPPORT);

supportConn.on('connected', () => {
  console.log('✅ Support DB connected:', supportConn.name);
});

supportConn.on('error', (err) => {
  console.error('❌ Support DB error:', err.message);
});

export default supportConn;
