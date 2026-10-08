// importing initial packages
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';

import { initializingPassport } from '../controller/authController.js';

//importing admin and shop module
import adminRoutes from './admin.js';
import shopRoutes from './shop.js';
import authRoutes from './auth.js';

// views are bundled with the Netlify Function, so look them up from the project root
const findDir = (name) => {
    const roots = [process.cwd(), process.env.LAMBDA_TASK_ROOT].filter(Boolean);
    for (const root of roots) {
        const dir = path.join(root, name);
        if (fs.existsSync(dir)) return dir;
    }
    return path.join(process.cwd(), name);
}

const sessionSecret = process.env.SESSION_SECRET || (process.env.NETLIFY_DEV ? 'yourprints-local-dev-secret' : null);
if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is not set');
}

const app = express();

// Netlify sits in front of the function as a proxy
app.set('trust proxy', true);

//receving static files (served by the Netlify CDN in production; this only matters locally)
for (const dir of ['Public', 'Assets']) {
    const full = findDir(dir);
    if (fs.existsSync(full)) {
        app.use(express.static(full));
        app.use('/' + dir, express.static(full));
    }
}

//using ejs templating engine
app.set('view engine', 'ejs');
app.set('views', findDir('views'));

//passing body request
//extended: true => give ability to take object within object
app.use(bodyParser.urlencoded({ extended: true }))

//saving the logged in user in a signed cookie, so it works across serverless invocations
app.use(cookieSession({
    name: 'yourprints.sid',
    keys: [sessionSecret],
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
}));

// passport 0.7 expects regenerate/save on the session, which cookie-session doesn't provide
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => cb();
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => cb();
    }
    next();
});

initializingPassport(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use((req, res) => {
    res.status(404).send('<h1>Page not found</h1><p><a href="/">Back to YourPrints</a></p>');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('<h1>Something went wrong</h1><p><a href="/">Back to YourPrints</a></p>');
});

export default app;
