const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo');
const http = require('http');
const ngrok = require('@ngrok/ngrok');

// Get your endpoint online
ngrok
  .connect({ addr: 3000, authtoken_from_env: true })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`));

// Load config
dotenv.config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

// Connect DB
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs');

// Handlebars
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    extname: '.hbs',
    defaultLayout: 'main',
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('partials', path.join(__dirname, 'views/partials'));

console.log('views', app.get('views'));
console.log('partials', app.get('partials'));

// Set session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Set passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

console.log(app.get('views'));
app.disable('view cache');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`);
});

// ChatGPT
// Get your endpoint online with Ngrok
/* ngrok.connect({
  proto: 'http',
  addr: PORT,
}).then((url) => {
  console.log(`Application is accessible at: ${url}`);
}).catch((err) => {
  console.error('Error while connecting with Ngrok:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server and Ngrok...');
  server.close();
  ngrok.disconnect();
  process.exit(0);
}); */

// Ngrok
// Create webserver
/* http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Congrats you have created an ngrok web server');
  })
  .listen(8080, () => console.log('Node.js web server at 8080 is running...'));
  
  // Get your endpoint online
ngrok
  .connect({ addr: 3000, authtoken_from_env: true })
  .then((listener) => console.log(`Ingress established at: ${listener.url()}`));
  */
