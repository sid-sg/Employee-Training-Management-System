import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
