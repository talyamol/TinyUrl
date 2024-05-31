import express from 'express';
import linkController from '../Controllers/LinksController.js';
const router = express.Router();


// קבלת כל הלינקים
router.get('/', linkController.getAllLinks);

// קבלת לינק לפי ID
router.get('/:id', linkController.getLinkById);

// יצירת לינק חדש
router.post('/', linkController.addLink);

// עדכון לינק קיים
router.put('/:id', linkController.updateLink);

// מחיקת לינק
router.delete('/:id', linkController.deleteLink);

// קבלת כל הלינקים של משתמש לפי userId
router.get('/user-links/:userId', linkController.getUserLinks);

router.get('/redirect/:id', linkController.redirect);
router.get('/:id/click-stats', linkController.getClickStats); 

export default router;
