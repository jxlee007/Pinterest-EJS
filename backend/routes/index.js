const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import the exported mongoose instance from db.js
const userModel = require("./users");
const postModel = require("./posts");
const Board = require("./board");
const moment = require('moment');
const upload = require('./multer');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const apiAuthLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: { error: "Too many requests, please try again later." }
});

const localStrategy = require("passport-local");
const users = require('./users');

const apiWriteLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 write requests per windowMs
   standardHeaders: true,
   legacyHeaders: false,
});
passport.use(new localStrategy(userModel.authenticate()));

const authMeLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 requests per windowMs
   standardHeaders: true,
   legacyHeaders: false
});

router.get('/', function (req, res, next) {
   res.render('welcome', { nav: false });
});

router.get('/sample', function (req, res, next) {
   res.render('feed-3', {  nav: true });
});

router.get('/api/posts', async function (req, res, next) {
   try {
      const { title } = req.query;
      const filteredPosts = await postModel.find({ title: { $regex: new RegExp(title, 'i') } });
      res.json(filteredPosts);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.get('/register', function (req, res, next) {
   res.render('login', { nav: false });
});

router.get('/login', function (req, res) {
   console.log(req.flash("error"));
   res.render('register', { error: req.flash('error'), nav: false });
});

router.get('/auth/me', authMeLimiter, async function (req, res, next) {
   if (req.isAuthenticated()) {
      try {
         const user = await userModel.findOne({ username: req.session.passport.user });
         res.json({ user });
      } catch (error) {
         res.status(500).json({ error: "Server error" });
      }
   } else {
      res.json({ user: null });
   }
});

router.get('/api/explore', async function (req, res, next) {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const posts = await postModel.find().populate("user").populate("board").skip(skip).limit(limit);
      const boards = await Board.find();
      res.json({ posts, boards });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.get('/api/profile', apiAuthLimiter, isLoggedInApi, async function (req, res, next) {
   try {
      const user = await userModel
         .findOne({ username: req.session.passport.user })
         .populate({
            path: 'boards',
            populate: {
               path: 'posts',
               model: 'Post'
            }
         });
      res.json({ user });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.get('/edit', isLoggedIn, async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user });
      res.render('edit', { user, nav: false });
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.post('/api/fileupload', apiAuthLimiter, isLoggedInApi, upload.single('profile-image'), async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.profileImage = req.file.filename;
      await user.save();
      res.json({ user, message: "Profile image updated" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

const editApiLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100,
   message: { error: "Too many requests, please try again later." }
});

router.post('/api/edit', editApiLimiter, isLoggedInApi, async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user });
      if (req.body.username && req.body.username.trim() !== '') {
         user.username = req.body.username;
      }
      if (req.body.email && req.body.email.trim() !== '') {
         user.email = req.body.email;
      }
      if (req.body.fullname && req.body.fullname.trim() !== '') {
         user.fullname = req.body.fullname;
      }
      if (req.body.phone && req.body.phone.trim() !== '') {
         user.contact = req.body.phone;
      }
      await user.save();
      res.json({ user, message: "Profile updated" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.get('/api/board/:boardId', isLoggedInApi, async function (req, res, next) {
   try {
      const board = await Board
         .findById(req.params.boardId)
         .populate({
            path: 'posts',
            model: 'Post'
         });
      if (!board) {
         return res.status(404).json({ message: 'Board not found' });
      }
      res.json({ board });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.delete('/api/delete-board/:boardId', isLoggedInApi, async function (req, res, next) {
   try {
      const board = await Board.findById(req.params.boardId);
      if (!board) {
         return res.status(404).send({ message: 'Board not found' });
      }
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.boards = user.boards.filter(boardId => !boardId.equals(board._id));
      await user.save();
      await Board.findByIdAndDelete(req.params.boardId);
      res.json({ message: "Board deleted" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.get('/add', isLoggedIn, async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user })
         .populate("boards");
      res.render('add', { user, nav: true });
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.get('/api/feed', apiAuthLimiter, isLoggedInApi, async function (req, res, next) {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const user = await userModel.findOne({ username: req.session.passport.user });
      const posts = await postModel.find({ user: user._id }).populate("user").skip(skip).limit(limit);
      res.json({ posts });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.get('/api/post/:postId', isLoggedInApi, async function (req, res, next) {
   try {
      const post = await postModel.findById(req.params.postId).populate("user").populate("board");
      if (!post) {
         return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ post });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.post('/api/createpost', apiWriteLimiter, isLoggedInApi, upload.single('postimage'), async function (req, res, next) {
   try {
      if (!req.file) {
         return res.status(400).send("No Files were uploaded.");
      }
      const user = await userModel.findOne({ username: req.session.passport.user });
      const post = await postModel.create({
         postImage: req.file.filename,
         desc: req.body.description,
         title: req.body.title,
         user: user._id,
         board: req.body.board,
      });
      user.posts.push(post._id);
      await user.save();
      const board = await Board.findById(req.body.board);
      if (board) {
         board.posts.push(post._id);
         await board.save();
      }
      res.json({ post, message: "Post created successfully" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.delete('/api/delete-post/:postId', apiWriteLimiter, isLoggedInApi, async function (req, res, next) {
   try {
      const post = await postModel.findById(req.params.postId);
      if (!post) {
         return res.status(404).json({ message: 'Post not found' });
      }
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.posts = user.posts.filter(postId => !postId.equals(post._id));
      await user.save();
      await postModel.findByIdAndDelete(req.params.postId);
      res.json({ message: 'Post deleted successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.post('/api/board', isLoggedInApi, async function (req, res, next) {
   try {
      const board = await Board.create({ name: req.body.boardname });
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.boards.push(board._id);
      await user.save();
      res.json({ board, message: "Board created successfully" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.post('/api/addposttoboard', isLoggedInApi, async function (req, res, next) {
   try {
      const board = await Board.findById(req.body.board);
      board.posts.push(req.body.post);
      await board.save();
      res.json({ message: "Post added to board" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.post('/api/register', function (req, res, next) {
   const { username, email, fullname, contact, password } = req.body;
   const userdata = new userModel({
      username,
      email,
      fullname,
      contact,
   });
   userModel.register(userdata, password, (err, registeredUser) => {
      if (err) {
         console.error('Error registering user:', err);
         return res.status(500).json({ error: 'Registration failed', details: err.message });
      }
      passport.authenticate('local')(req, res, () => {
         res.json({ message: "Registration successful", user: registeredUser });
      });
   });
});

router.post('/api/login', function(req, res, next) {
   passport.authenticate('local', function(err, user, info) {
      if (err) { return res.status(500).json({ error: "Server error" }); }
      if (!user) { return res.status(401).json({ error: "Invalid credentials" }); }
      req.logIn(user, function(err) {
         if (err) { return res.status(500).json({ error: "Server error" }); }
         return res.json({ message: "Login successful", user });
      });
   })(req, res, next);
});

router.post('/api/logout', function (req, res, next) {
   req.logout(function (err) {
      if (err) { return res.status(500).json({ error: "Server error" }); }
      res.json({ message: "Logout successful" });
   });
});

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
};

function isLoggedInApi(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.status(401).json({ error: "Unauthorized" });
}

module.exports = router;
