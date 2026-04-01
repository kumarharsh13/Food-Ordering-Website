# Production-Level Restructure Design

## Goal

Restructure the Food Ordering Website from a single-file Express app into a clean MVC layered architecture suitable for a portfolio project. All existing functionality and URLs must be preserved.

## Current State

- Single 671-line `app.js` containing all routes, controllers, DB queries, and business logic
- Hardcoded DB credentials
- Plaintext passwords
- Global mutable cart state shared across all users
- No auth middleware (cookie checks duplicated ~15 times)
- Callback-based MySQL queries
- No error handling middleware
- Unused scaffolded route files (`routes/index.js`, `routes/users.js`)

## Target Structure

```
Food-Ordering-Website/
├── src/
│   ├── config/
│   │   └── db.js                # MySQL2 connection pool, reads from .env
│   ├── controllers/
│   │   ├── authController.js    # signup, signin, logout
│   │   ├── homeController.js    # landing page, homepage
│   │   ├── cartController.js    # cart display, update, checkout
│   │   ├── orderController.js   # confirmation, my orders
│   │   ├── settingsController.js # address, contact, password updates
│   │   └── adminController.js   # admin signin, add food, dispatch, change price
│   ├── models/
│   │   ├── userModel.js         # findById, findByEmail, create, updateAddress, updateContact, updatePassword
│   │   ├── menuModel.js         # getAll, getById, updatePrice, addItem
│   │   ├── orderModel.js        # create, getAll, deleteById
│   │   ├── orderDispatchModel.js # create, getByUserId
│   │   └── adminModel.js        # findByCredentials, findById
│   ├── routes/
│   │   ├── authRoutes.js        # GET/POST /signup, GET/POST /signin, GET /logout
│   │   ├── homeRoutes.js        # GET /, GET /homepage
│   │   ├── cartRoutes.js        # GET/POST /cart, POST /checkout
│   │   ├── orderRoutes.js       # GET /confirmation, GET /myorders
│   │   ├── settingsRoutes.js    # GET /settings, POST /address, POST /contact, POST /password
│   │   └── adminRoutes.js       # All /admin_* and /adminHomepage routes
│   ├── middleware/
│   │   ├── authMiddleware.js    # requireUser, requireAdmin session checks
│   │   └── errorHandler.js      # Centralized Express error handler
│   └── app.js                   # Express setup, middleware wiring, route mounting
├── public/                      # Static assets (unchanged)
├── views/                       # EJS templates (unchanged)
├── db/
│   └── schema.sql               # Moved from FoodOrderingWebsite.sql
├── bin/
│   └── www                      # Updated to require src/app.js
├── .env.example                 # DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, SESSION_SECRET, PORT
├── .gitignore                   # Add .env, .DS_Store, etc.
└── package.json                 # Updated deps + scripts
```

## Key Design Decisions

### 1. Config (src/config/db.js)

- Uses `mysql2` with `pool.promise()` for async/await support
- Reads credentials from `process.env` via `dotenv`
- Exports the promise pool for use in models

### 2. Models

- Each model exports plain async functions (not classes)
- Each function runs a single query and returns results
- Example: `userModel.findByEmail(email)` returns user row or null
- Models are the only layer that touches the database

### 3. Controllers

- Each controller function is `async (req, res, next)`
- Calls model functions, handles response rendering
- Errors caught and passed to `next()` for centralized handling
- No direct DB access

### 4. Routes

- Each route file creates an Express Router
- Maps HTTP methods + paths to controller functions
- Applies middleware (requireUser, requireAdmin) at the route level
- Mounted in app.js

### 5. Auth Middleware

- `requireUser`: checks `req.session.user` exists, attaches to `req.user`, redirects to `/signin` if missing
- `requireAdmin`: checks `req.session.admin` exists, attaches to `req.admin`, redirects to `/admin_signin` if missing
- Replaces ~15 duplicated cookie-check-and-query blocks

### 6. Cart State

- Moves from global variables to `req.session.cart` (per-user via express-session)
- Cart is an array of item IDs; item details fetched from DB when rendering

### 7. Password Security

- `bcryptjs` hashes passwords on signup
- `bcryptjs.compare()` on signin
- Existing plaintext passwords in DB won't work after this change (acceptable for portfolio project)

### 8. Session Management

- `express-session` with in-memory store (fine for dev/portfolio)
- Replaces raw cookie-based auth (`cookuid`, `cookuname`)
- Session stores `{ user: { id, name } }` or `{ admin: { id, name } }`

## Dependency Changes

**Add:** `mysql2`, `dotenv`, `bcryptjs`, `express-session`
**Remove:** `mysql`, `body-parser` (use Express built-in)
**Move to devDependencies:** `nodemon`
**Keep:** `uuid`, `express-fileupload`, `cookie-parser`, `ejs`, `morgan`, `http-errors`, `debug`

## Package.json Scripts

```json
{
  "start": "node ./bin/www",
  "dev": "nodemon ./bin/www"
}
```

## What Does NOT Change

- All EJS view templates
- All static assets in public/
- SQL schema structure (file just moves to db/schema.sql)
- All existing URL routes and their behavior
- The bin/www entry point (only the require path changes)

## Out of Scope

- Frontend changes (CSS, JS, templates)
- Database migrations or ORM
- Test suite (could be a follow-up)
- CI/CD pipeline
- Deployment configuration
- Input validation library (express-validator etc.)
