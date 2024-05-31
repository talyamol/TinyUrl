import User from '../Models/User.js';
import Link from '../Models/Link.js';

const linkController = {

  redirect: async (req, res) => {
    const { id } = req.params;
    const ipAddress = req.ip; // ניתן לקבל את כתובת ה-IP מהבקשה
    const targetParamValue = req.query[req.targetParamName] || ""; 

    try {
      const link = await Link.findById(id);
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }

      link.clicks.push({ ipAddress, targetParamValue });
      await link.save();

      res.redirect(link.originalUrl);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  getClickStats: async (req, res) => {
    const { id } = req.params;

    try {
      const link = await Link.findById(id);
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }

      const clickStats = link.clicks.reduce((acc, click) => {
        const target = click.targetParamValue;
        if (!acc[target]) {
          acc[target] = 0;
        }
        acc[target]++;
        return acc;
      }, {});

      res.json({ clickStats });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
// קבלת מידע על הקליקים של קישור עם פילוט לפי מקור הפרסום
getLinkClicksBySource: async (req, res) => {
  const linkId = req.params.id;

  try {
    const link = await Link.findById(linkId);
    if (!link) throw new Error('Link not found');

    // איחוד כל הערכים של targetParamValue למערך ייחודי
    const uniqueTargetValues = [...new Set(link.clicks.map(click => click.targetParamValue))];

    // בניית אובייקט שיכיל את המידע על הקליקים לפי מקור הפרסום
    const clicksBySource = uniqueTargetValues.map(value => {
      const clicksWithSameSource = link.clicks.filter(click => click.targetParamValue === value);
      return {
        source: value,
        clicks: clicksWithSameSource.length
      };
    });

    res.json(clicksBySource);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
},

  // קבלת כל הלינקים
  getAllLinks: async (req, res) => {
    try {
      const links = await Link.find();
      res.json(links);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // קבלת לינק לפי ID
  getLinkById: async (req, res) => {
    try {
      const link = await Link.findById(req.params.id);
      if (!link) return res.status(404).json({ message: 'Link not found' });
      res.json(link);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // יצירת לינק חדש
  addLink: async (req, res) => {
    try {
      const { userId } = req.body; // מקבלים את ה-ID של המשתמש מהבקשה
      const { originalUrl } = req.body; // מקבלים את ה-URL של הקישור מהבקשה
  
      // מציאת המשתמש במסד הנתונים על ידי ה-ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // יצירת הקישור החדש
      const newLink = await Link.create({ originalUrl });
  
      // הוספת הקישור למערך הקישורים של המשתמש
      user.links.push(newLink);
      await user.save();
  
      res.status(201).json(newLink);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  

  // עדכון לינק קיים
  updateLink: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedLink = await Link.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedLink);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // מחיקת לינק
  deleteLink: async (req, res) => {
    try {
      const link = await Link.findById(req.params.id);
      if (!link) return res.status(404).json({ message: 'Link not found' });

      await link.remove();
      res.json({ message: 'Link deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // קבלת כל הלינקים של משתמש לפי userId
  getUserLinks: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate('links');
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json(user.links);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default linkController;