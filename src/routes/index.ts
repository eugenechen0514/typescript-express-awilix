import express from 'express';
import Users from './users';

const router = express.Router();
router.use('/user', Users);

export default router;
