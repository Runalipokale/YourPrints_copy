import crypto from 'node:crypto';
import { promisify } from 'node:util';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';

const scrypt = promisify(crypto.scrypt);

// passwords are stored as "salt:hash" using scrypt
const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scrypt(password, salt, 64);
    return `${salt}:${hash.toString('hex')}`;
}

const verifyPassword = async (password, stored) => {
    const [salt, hash] = (stored || '').split(':');
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, 'hex');
    const actual = await scrypt(password, salt, expected.length);
    return crypto.timingSafeEqual(expected, actual);
}

export const getLogin = (req, res, next) => {
    res.render('login', {
        path: '/login',
        pageTitle: 'User Login',
    });
}

// Configure LocalStrategy
export const initializingPassport = (passport) => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const [user] = await db.select().from(users).where(eq(users.username, username));

                if (!user || !(await verifyPassword(password, user.password))) {
                    return done(null, false, { message: 'Incorrect username or password.' });
                }

                // Authentication successful
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    passport.deserializeUser(async (userId, done) => {
        try {
            const [user] = await db.select().from(users).where(eq(users.userId, userId));
            done(null, user || false);
        } catch (e) {
            done(e, false);
        }
    });
};

// Route handler for user login
export const postLogin = passport.authenticate('local', {
    failureRedirect: '/login', // Redirect on login failure
    successRedirect: '/profile', // Redirect on successful login
});

// Logout route
export const postlogOut = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
}

// Sign up
export const getSignUp = (req, res, next) => {
    res.render('signUp', {
        path: '/user/signUp',
        pageTitle: 'Sign Up'
    });
}

export const postSignUp = async (req, res, next) => {
    try {
        const { username, password, confirmPassword, email, phoneNumber, address } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        if (confirmPassword !== undefined && password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const [existing] = await db.select().from(users).where(eq(users.username, username));
        if (existing) {
            return res.status(400).send('User already exists');
        }

        await db.insert(users).values({
            username,
            email,
            phoneNumber: phoneNumber || '',
            address: address || '',
            password: await hashPassword(password),
        });
        res.redirect('/login');
    } catch (err) {
        next(err);
    }
}

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

export const getUserProfile = (req, res, next) => {
    // Send visitors who aren't logged in to the login page
    if (!req.user) {
        return res.redirect('/login');
    }

    res.render('profile', {
        pageTitle: 'User Profile',
        user: req.user,
        path: '/profile'
    });
};
