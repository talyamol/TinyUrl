import express from 'express';
import UsersController from '../Controllers/UsersController.js';

const router = express.Router();

// מסלול לקבלת כל המשתמשים
router.get('/', UsersController.getAllUsers);

// מסלול לקבלת משתמש לפי ID
router.get('/:id', UsersController.getUserById);

// מסלול ליצירת משתמש חדש
router.post('/', UsersController.addUser);

// מסלול לעדכון משתמש קיים לפי ID
router.put('/:id', UsersController.updateUser);

// מסלול למחיקת משתמש לפי ID
router.delete('/:id', UsersController.deleteUser);

export default router;
