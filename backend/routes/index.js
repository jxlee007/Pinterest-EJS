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
   res.redirect('http://localhost:3001');
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
   // Legacy EJS route redirecting to Next.js
   res.redirect('http://localhost:3000/register');
});

router.get('/login', function (req, res) {
   // Legacy EJS route redirecting to Next.js
   res.redirect('http://localhost:3000/login');
});

router.get('/auth/me', authMeLimiter, async function (req, res, next) {
   res.json({ user: req.user || null });
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
         .findById(req.user._id)
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
      res.render('edit', { user: req.user, nav: false });
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.post('/api/fileupload', apiAuthLimiter, isLoggedInApi, upload.single('profile-image'), async function (req, res, next) {
   try {
      const user = req.user;
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
      const user = req.user;
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

router.get('/api/board/:boardId', apiAuthLimiter, isLoggedInApi, async function (req, res, next) {
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

router.delete('/api/delete-board/:boardId', apiAuthLimiter, isLoggedInApi, async function (req, res, next) {
   try {
      const board = await Board.findById(req.params.boardId);
      if (!board) {
         return res.status(404).send({ message: 'Board not found' });
      }
      const user = req.user;
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
      const user = await userModel.findById(req.user._id)
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

      const posts = await postModel.find({ user: req.user._id }).populate("user").skip(skip).limit(limit);
      res.json({ posts });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.get('/api/post/:postId', apiAuthLimiter, isLoggedInApi, async function (req, res, next) {
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
      const user = req.user;
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
      const user = req.user;
      user.posts = user.posts.filter(postId => !postId.equals(post._id));
      await user.save();
      await postModel.findByIdAndDelete(req.params.postId);
      res.json({ message: 'Post deleted successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.post('/api/board', apiAuthLimiter, isLoggedInApi, async function (req, res, next) {
   try {
      const board = await Board.create({ name: req.body.boardname });
      const user = req.user;
      user.boards.push(board._id);
      await user.save();
      res.json({ board, message: "Board created successfully" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

router.post('/api/addposttoboard', apiAuthLimiter, isLoggedInApi, async function (req, res, next) {
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

router.post('/api/register', apiAuthLimiter, async function (req, res, next) {
   try {
      const { username, email, fullname, contact, password } = req.body;
      const userdata = new userModel({ username, email, fullname, contact });

      // passport-local-mongoose registers and hashes password
      userModel.register(userdata, password)
         .then(function(registeredUser) {
            passport.authenticate("local")(req, res, function() {
               res.status(201).json({ success: true, user: req.user, message: "Registration successful" });
            });
         })
         .catch(err => {
            console.error('Error registering user:', err);
            res.status(400).json({ error: err.message });
         });
   } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: "Registration failed" });
   }
});

router.post('/api/login', apiAuthLimiter, function(req, res, next) {
   passport.authenticate('local', function(err, user, info) {
      if (err) return res.status(500).json({ error: "Server error" });
      if (!user) return res.status(401).json({ error: "Invalid username or password" });

      req.logIn(user, function(err) {
         if (err) return res.status(500).json({ error: "Login failed" });
         return res.status(200).json({ success: true, user: req.user, message: "Login successful" });
      });
   })(req, res, next);
});

router.get('/api/logout', apiAuthLimiter, function (req, res, next) {
   req.logout(function (err) {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
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
   res.status(401).json({ error: "You must be logged in" });
}

module.exports = router;
