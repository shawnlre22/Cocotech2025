import express from 'express';
import * as dbController from '../controllers/db.controller.js';

const router = express.Router();

router.get('/init', dbController.initDB);

export default router;