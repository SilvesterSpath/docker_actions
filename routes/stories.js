const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const Story = require('../models/Story');

// Show add page
// GET /stories/add
router.get('/add', auth.ensureAuth, (req, res) => {
  res.render('stories/add');
});

// Show single story
// GET /stories/:id
router.get('/:id', auth.ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id })
      .populate('user')
      .lean();
    if (!story) {
      return res.render('error/404');
    }
    res.render('stories/show', { story });
  } catch (error) {
    console.error(error.stack);
    res.render('error/500', { error });
  }
});

// Process add form
// POST /stories
router.post('/', auth.ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    /*     const story = new Story({
      title: req.body.title || 'Untitled',
      content: req.body.content || 'default content',
      user: req.user.id,
    }); */
    /* await story.save(); */
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error/500', { error });
  }
});

// Show all stories
// GET /stories
router.get('/', auth.ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('stories/index', { stories });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// Edith stories
// Put /stories/edit/:id
router.get('/edit/:id', auth.ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user.toString() !== req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', { story });
    }
  } catch (error) {
    console.error(err.stack);
    return res.render('error/500');
  }
});

// Update story
// PUT /stories/:id
router.put('/:id', auth.ensureAuth, async (req, res) => {
  try {
    let story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user.toString() !== req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect(`/dashboard`);
    }
  } catch (error) {
    console.error(err.stack);
    return res.render('error/500');
  }
});

// Delete story
// DELETE /stories/:id
router.delete('/:id', auth.ensureAuth, async (req, res) => {
  try {
    await Story.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err.stack);
    return res.render('error/500');
  }
});

// User stories
// GET /stories/user/:userId
router.get('/user/:userId', auth.ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('stories/index', { stories });
  } catch (error) {
    console.error(error.stack);
    res.render('error/500');
  }
});

module.exports = router;
