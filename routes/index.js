const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const Story = require('../models/Story');

// @desc Login/Landing page
// @route GET /
router.get('/', auth.ensureGuest, (req, res) => {
  res.render('loginview', { layout: 'login' });
});

router.get('/header', (req, res) => {
  res.render('partials/header', { layout: 'main' });
});

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', auth.ensureAuth, async (req, res) => {
  try {
    // we should use .lean() to be able to render it
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render('dashboard', { name: req.user.displayName, stories });
  } catch (error) {
    console.error(error);
    res.render('error/500', { error });
  }
});

module.exports = router;
