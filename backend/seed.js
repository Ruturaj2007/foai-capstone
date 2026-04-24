import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';

const seedUser = async () => {
  await connectDB();

  try {
    const existing = await User.findOne({ email: 'test@scaler.com' });

    if (existing) {
      console.log('⚠️  Test user already exists, skipping insert.');
    } else {
      const user = await User.create({
        email: 'test@scaler.com',
        password: 'testpassword123',
      });
      console.log('🎉 Sample user inserted:', user);
    }
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  } finally {
    process.exit(0);
  }
};

seedUser();
