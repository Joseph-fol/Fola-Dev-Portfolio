import express from 'express';

const router = express.Router();

let storedSkills = null;

router.get('/', (req, res) => {
  res.json({ success: true, data: storedSkills || [] });
});

router.put('/', (req, res) => {
  const { skills } = req.body;

  if (!Array.isArray(skills)) {
    return res.status(400).json({ success: false, error: 'Skills must be an array' });
  }

  storedSkills = skills;
  return res.json({ success: true, data: storedSkills });
});

export default router;
