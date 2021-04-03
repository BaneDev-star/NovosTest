const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

var Bank = require("../models/bank");
var Plan = require("../models/plan");
var User = require("../models/users");

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const BCRYPT_SALT_ROUNDS = 12;
const AUTH_JWT_SECRET = 'jwt_secret_for_iot';

const storageForAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'avatars/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
});
const uploadForAvatar = multer({ storage: storageForAvatar });

require('dotenv').config();

// DB Setup
var mongoose = require('mongoose');

var DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://novos:<password>@cluster0.bqivk.mongodb.net';
var PORT = 27017;
var DB_NAME = 'novosbane';
mongoose.connect('mongodb+srv://novos:novos@cluster0.bqivk.mongodb.net/novosbane', { useNewUrlParser: true });

var db = mongoose.connection;


db.on('error', function (error) {
  // If first connect fails because server-database isn't up yet, try again.
  // This is only needed for first connect, not for runtime reconnects.
  // See: https://github.com/Automattic/mongoose/issues/5169
  if (error.message && error.message.match(/failed to connect to server .* on first connect/)) {
    setTimeout(function () {
      mongoose.connect('mongodb+srv://novos:novos@cluster0.bqivk.mongodb.net/novosbane', { useNewUrlParser: true }).catch(() => {
        // empty catch avoids unhandled rejections
      });
    }, 20 * 1000);
  } else {
    // Some other error occurred.  Log it.
    console.error(new Date(), String(error));
  }
});

db.once("open", function (callback) {
  console.log("Connection Succeeded");
});

// SERVER Setup
app.get('/banks', async (req, res) => {
  let token = req.headers['x-access-token'];
  let decoded = await jwt.verify(token, AUTH_JWT_SECRET);
  const profile = await User.findOne({
    email: decoded.id
  }).lean();
  Bank.find({ userId: profile._id }, 'title description isAssigned', function (error, banks) {
    if (error) {
      console.error(error);
    }
    res.send({
      banks: banks
    })
  }).sort({ order: 1 })
});

app.get('/plans', async (req, res) => {
  let token = req.headers['x-access-token'];
  let decoded = await jwt.verify(token, AUTH_JWT_SECRET);
  const profile = await User.findOne({
    email: decoded.id
  }).lean();
  Plan.find({ userId: profile._id }, null, function (error, plans) {
    if (error) {
      console.error(error);
    }
    res.send({
      plans: plans
    })
  }).sort({ order: 1 })
});

app.post('/clearPlans', async (req, res) => {
  let token = req.headers['x-access-token'];
  let decoded = await jwt.verify(token, AUTH_JWT_SECRET);
  const profile = await User.findOne({
    email: decoded.id
  }).lean();
  Plan.find({ userId: profile._id }, null, function(err, plans) {
    plans.map(plan => plan.remove());
  });
  res.send({
    success: true
  })
});


// Bank Endpoints
app.post('/banks', async (req, res) => {
  let token = req.headers['x-access-token'];
  let decoded = await jwt.verify(token, AUTH_JWT_SECRET);
  const profile = await User.findOne({
    email: decoded.id
  }).lean();

  var db = req.db;
  var title = req.body.title;
  var description = req.body.description;
  let userId = profile._id;
  var new_post = new Bank({
    title: title,
    description: description,
    userId: userId,
    order: req.body.order
  });

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      data: new_post,
      message: 'Bank saved successfully!'
    })
  })
});

app.post('/banksOrder', async (req, res) => {
  let token = req.headers['x-access-token'];
  let decoded = await jwt.verify(token, AUTH_JWT_SECRET);
  const profile = await User.findOne({
    email: decoded.id
  }).lean();

  const userId = profile._id;
  let orderedIds = req.body.orderedIds;

  Bank.find({ userId: userId }, 'title description isAssigned', function (error, banks) {
    if (error) {
      console.error(error);
    }
    const orderedBanks = orderedIds.map(orderedId => banks.find(bank => bank._id.toString() === orderedId));

    Bank.remove({
      userId: userId
    }, function (err, post) {
      if (err) {
        console.error(err);
      }
      orderedBanks.map((item, index) => {
        if (item) {
          const new_post = new Bank({
            _id: item._id,
            title: item.title,
            description: item.description,
            order: index + 1,
            userId: userId
          });
          new_post.save();
        }
      });
      res.send({
        success: true,
      })
    });
  }).sort({ order: 1 })
});


app.post('/planOrder', async (req, res) => {
  let token = req.headers['x-access-token'];
  let decoded = await jwt.verify(token, AUTH_JWT_SECRET);
  const profile = await User.findOne({
    email: decoded.id
  }).lean();

  const userId = profile._id;
  let orderedIds = req.body.orderedIds;

  Plan.find({ userId: userId }, 'title description isAssigned', function (error, plans) {
    if (error) {
      console.error(error);
    }
    const orderedPlan = orderedIds.map(orderedId => plans.find(item => item._id.toString() === orderedId));

    Plan.remove({
      userId: userId
    }, function (err, post) {
      if (err) {
        console.error(err);
      }
      orderedPlan.map((item, index) => {
        if (item) {
          const new_post = new Plan({
            _id: item._id,
            title: item.title,
            description: item.description,
            order: index + 1,
            isCompleted: item.isCompleted,
            userId: userId
          });
          new_post.save();
        }
      });
      res.send({
        success: true,
      })
    });
  }).sort({ order: 1 })

});

// Update a post
app.put('/banksAssign/:id', async (req, res) => {
  let token = req.headers['x-access-token'];
  let decoded = await jwt.verify(token, AUTH_JWT_SECRET);
  const profile = await User.findOne({
    email: decoded.id
  }).lean();

  const userId = profile._id;
  var db = req.db;
  const isAssigned = req.body.isAssigned;
  const orderNumber = req.body.order;
  if (isAssigned) {
    Bank.findById(req.params.id, 'title description', function (error, bank) {
      const new_plan = new Plan({
        title: bank.title,
        description: bank.description,
        order: orderNumber,
        isCompleted: false,
        userId: userId
      });
      new_plan.save();
      bank.remove();
      res.send({
        success: true,
        data: new_plan
      })
    });
  } else {
    Plan.findById(req.params.id, 'title description', function (error, plan) {
      const new_bank = new Bank({
        title: plan.title,
        description: plan.description,
        order: orderNumber,
        userId: userId
      });
      new_bank.save();
      plan.remove();
      res.send({
        success: true,
        data: new_bank
      })
    })
  }
});

// Update a post
app.put('/planComplete/:id', (req, res) => {
  var db = req.db;
  Plan.findById(req.params.id, 'title description', function (error, plan) {
    if (error) {
      console.error(error);
    }

    plan.isCompleted = req.body.isCompleted;
    plan.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
});

// Delete a post
app.delete('/banks/:id', (req, res) => {
  var db = req.db;
  Bank.remove({
    _id: req.params.id
  }, function (err, post) {
    if (err)
      res.send(err);
    res.send({
      success: true
    })
  })
});


// Signup Endpoints
app.post('/signup', uploadForAvatar.single('avatar'), async (req, res) => {
  let password = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);

  const existingUser = await User.findOne(
    {
      email: req.body.email
    }
  );
  if (existingUser) {
    return res.send({
      success: false,
      message: "Email is already in use"
    })
  }

  var new_user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: password,
    email: req.body.email
  });
  if (req.file && req.file.filename)
    new_user.avatar = req.file.filename;

  new_user.save(function (error) {
    if (error) {
      console.log(error);
      return res.send({
        success: false,
        message: "Failed to register"
      })
    }
    const token = jwt.sign(
      { id: req.body.email },
      AUTH_JWT_SECRET,
    );
    res.send({
      success: true,
      message: 'User have been registered successfully!',
      token: token
    })
  })
});

// Signin Endpoint
app.post('/signin', async (req, res) => {
  const user = await User.findOne(
    {
      email: req.body.email
    }
  );
  if (!user) {
    return res.send({
      success: false,
      message: "Wrong email or password"
    })
  }

  const passwordsMatch = await bcrypt.compare(
    req.body.password,
    user.password,
  );

  if (!passwordsMatch) {
    return res.send({
      success: false,
      message: "Wrong email or password"
    })
  }

  const token = jwt.sign(
    { id: user.email },
    AUTH_JWT_SECRET,
  );
  return res.send({
    success: true,
    token: token
  })
});

app.listen(process.env.PORT || 8081);
