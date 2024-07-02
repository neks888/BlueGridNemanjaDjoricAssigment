import express from 'express';
import filesRouter from './routes/files';

const app = express();
const port = 3000;

app.use('/api/files', filesRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
