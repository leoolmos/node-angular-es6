import express from 'express';
import users from '../controllers/users';

const router = express.Router()

router.get('/users', users.index );

export default router