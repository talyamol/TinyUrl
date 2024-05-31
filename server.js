import express from 'express';
import mongoose from 'mongoose';
import getPort from 'get-port';
import cors from 'cors';
import userRoutes from './Routers/userRouter.js';
import linkRoutes from './Routers/linkRouter.js';

const app = express();
const port = await getPort({ port: 3000 });

// Middleware לעבודה עם JSON
app.use(express.json());

app.use(cors());

// הגדרת המסלולים
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

// חיבור ל-MongoDB
const mongoURI = 'mongodb://localhost:27017/tinyLink';

mongoose.connect(mongoURI, {
}).then(() => {
  console.log('Connected to MongoDB');
  // הפעלת השרת לאחר חיבור מוצלח למסד הנתונים
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});



// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
