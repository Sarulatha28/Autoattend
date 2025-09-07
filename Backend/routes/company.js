// backend/routes/company.js
import express from 'express';
import Company from '../models/Company.js'; // ✅ add .js extension

const router = express.Router();

// Create or update company geofence
// POST /api/company/create
router.post('/create', async (req, res) => {
  try {
    const { name, companyId, latitude, longitude, radiusMeters } = req.body;
    if (!name || !companyId || latitude == null || longitude == null) {
      return res.status(400).json({ msg: 'Missing fields' });
    }

    const center = { type: 'Point', coordinates: [Number(longitude), Number(latitude)] };

    const doc = await Company.findOneAndUpdate(
      { companyId },
      { name, companyId, geofence: { center, radiusMeters: Number(radiusMeters || 50) } },
      { upsert: true, new: true }
    );

    res.json({ ok: true, company: doc });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get company by companyId
// GET /api/company/:companyId
router.get('/:companyId', async (req, res) => {
  try {
    const c = await Company.findOne({ companyId: req.params.companyId });
    if (!c) return res.status(404).json({ msg: 'Company not found' });
    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router;
