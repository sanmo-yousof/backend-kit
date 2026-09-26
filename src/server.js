import app from './app.js';
import env from './config/env.js'



const startServer = async () => {
//   await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();