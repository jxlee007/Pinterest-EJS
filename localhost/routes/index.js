const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import the exported mongoose instance from db.js
const userModel = require("./users");
const postModel = require("./posts");
const Board = require("./board");
const moment = require('moment');
const upload = require('./multer');
const passport = require('passport');

const localStrategy = require("passport-local");
const users = require('./users');
passport.use(new localStrategy(userModel.authenticate()));

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

router.get('/explore', async function (req, res, next) {
   try {
      const posts = await postModel.find().populate("user").populate("board");
      const boards = await Board.find();
      let user = null;
      if (req.session && req.session.passport && req.session.passport.user) {
         user = await userModel.findOne({ username: req.session.passport.user });
      }
      res.render('explore', { user, moment: moment, posts: posts, boards: boards, nav: true });
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
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
      console.log(user);
      res.render('profile', { user, nav: true });
   } catch (error) {
      console.error(error);
      next(error);
   }
}, function (req, res) {
   req.flash('error', 'Please register or log in to access this page.');
   res.redirect('/login');
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

router.post('/fileupload', isLoggedIn, upload.single('profile-image'), async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.profileImage = req.file.filename;
      await user.save();
      res.redirect('/profile');
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.post('/edit', isLoggedIn, async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user });
      if (req.body.username.trim() !== '') {
         user.username = req.body.username;
      }
      if (req.body.email.trim() !== '') {
         user.email = req.body.email;
      }
      if (req.body.fullname.trim() !== '') {
         user.fullname = req.body.fullname;
      }
      if (req.body.fullname.trim() !== '') {
         user.contact = req.body.phone;
      }
      await user.save();
      res.redirect('/profile');
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.get('/show/board/:boardId', isLoggedIn, async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user });
      const board = await Board
         .findById(req.params.boardId)
         .populate({
            path: 'posts',
            model: 'Post'
         });
      console.log(board);
      res.render('show', { board, user, nav: true });
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.delete('/delete-board/board/:boardId', isLoggedIn, async function (req, res, next) {
   try {
      const board = await Board.findById(req.params.boardId);
      if (!board) {
         return res.status(404).send({ message: 'Board not found' });
      }
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.boards = user.boards.filter(boardId => !boardId.equals(board._id));
      await user.save();
      await Board.findByIdAndDelete(req.params.boardId);
      res.redirect('/profile');
   } catch (error) {
      console.error(error);
      next(error);
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

router.get('/feed', isLoggedIn, async function (req, res, next) {
   try {
      const user = await userModel.findOne({ username: req.session.passport.user })
      const posts = await postModel.find({ user: user._id }).populate("user")
      res.render('feed', { user, posts, moment: moment, nav: true });
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.post('/createpost', isLoggedIn, upload.single('postimage'), async function (req, res, next) {
   try {
      if (!req.file) {
         return res.status(400).send("No Files were uploaded.");
      }
      const user = await userModel.findOne({ username: req.session.passport.user });
      const post = await postModel.create({
         postImage: req.file.filename,
         desc: req.file.description,
         title: req.body.title,
         user: user._id,
         board: req.body.board,
      });
      user.posts.push(post._id);
      await user.save();
      const board = await Board.findById(req.body.board);
      board.posts.push(post._id);
      await board.save();
      res.redirect("/profile");
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.delete('/delete-post/:postId', isLoggedIn, async function (req, res, next) {
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
      next(error);
   }
});

router.post('/board', isLoggedIn, async function (req, res, next) {
   try {
      const board = await Board.create({ name: req.body.boardname });
      const user = await userModel.findOne({ username: req.session.passport.user });
      user.boards.push(board._id);
      await user.save();
      res.redirect('/profile');
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.post('/addposttoboard', isLoggedIn, async function (req, res, next) {
   try {
      const board = await Board.findById(req.body.board);
      board.posts.push(req.body.post);
      await board.save();
      res.redirect('/board');
   } catch (error) {
      console.error(error);
      next(error);
   }
});

router.post('/register', function (req, res, next) {
   const { username, email, fullname, contact, password } = req.body.combinedData;
   const userdata = new userModel({
      username,
      email,
      fullname,
      contact,
   });
   userModel.register(userdata, password, (err, registeredUser) => {
      if (err) {
         console.error('Error registering user:', err);
         return res.status(500).json({ error: 'Registration failed' });
      }
      passport.authenticate('local')(req, res, () => {
         res.redirect('/profile');
      });
   });
});

router.post('/login', passport.authenticate('local', {
   successRedirect: '/profile',
   failureRedirect: "/login",
   failureFlash: true,
}), function (req, res) {});

router.get('/logout', function (req, res, next) {
   req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect("/login");
   });
});

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect("/login");
};

module.exports = router;
