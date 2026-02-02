import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import { config } from './config';
import { connectDatabase } from './utils/database';
import logger from './utils/logger';
import monitoringService from './services/monitoringService';
import reportService from './services/reportService';

import alertsRouter from './routes/alerts';
import newsRouter from './routes/news';
import reportsRouter from './routes/reports';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/alerts', alertsRouter);
app.use('/api/news', newsRouter);
app.use('/api/reports', reportsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Venezuela Monitor API is running',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/trigger-monitoring', async (req, res) => {
  try {
    logger.info('Manual monitoring cycle triggered');
    monitoringService.runMonitoringCycle();
    res.json({
      success: true,
      message: 'Monitoring cycle started',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start monitoring cycle',
    });
  }
});

app.post('/api/trigger-report', async (req, res) => {
  try {
    logger.info('Manual report generation triggered');
    const report = await reportService.generateDailyReport();
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate report',
    });
  }
});

monitoringService.on('breaking-news', (data) => {
  logger.info('Breaking news alert:', data.alert.title);
  io.emit('breaking-news', data);
});

io.on('connection', (socket) => {
  logger.info('Client connected:', socket.id);

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
});

cron.schedule('*/5 * * * *', async () => {
  logger.info('Running scheduled monitoring cycle...');
  await monitoringService.runMonitoringCycle();
});

cron.schedule('0 23 * * *', async () => {
  logger.info('Generating daily report...');
  const report = await reportService.generateDailyReport();
  if (report) {
    io.emit('daily-report', report);
    logger.info('Daily report generated and broadcast');
  }
});

const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info('Note: Redis is optional and not required for basic functionality');
      
      monitoringService.runMonitoringCycle();
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
