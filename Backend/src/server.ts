import { app } from './app';
import { config } from './config/env';
import { prisma } from './config/db';

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✓ SQLite database connected successfully.');

    app.listen(config.port, '0.0.0.0', () => {
      console.log(`=================================================`);
      console.log(`🚀 BeKids Backend API Server running on port ${config.port}`);
      console.log(`📡 Local URL:    http://localhost:${config.port}/api`);
      console.log(`🏥 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`📖 Environment:  ${config.nodeEnv}`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
