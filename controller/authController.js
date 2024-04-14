const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

exports.getLogin = (req, res, next) => {
    res.render('login', {
        path: '/login',
        pageTitle: 'User Login',
    });
}

// Configure LocalStrategy
exports.initializingPassport = (passport) => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({ where: { username: username } });

                if (!user) {
                    // User not found
                    return done(null, false, { message: 'Incorrect username.' });
                }

                if (user.password !== password) {
                    // Incorrect password
                    return done(null, false, { message: 'Incorrect password.' });
                }

                // Authentication successful
                return done(null, user);
            } catch (err) {
                // Handle errors
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.userId); // Corrected to user.id
    });

    passport.deserializeUser(async (userId, done) => {
        try {
            const user = await User.findByPk(userId); // Corrected to findByPk
            done(null, user);
        } catch (e) {
            done(e, false);
        }
    });
};


// Route handler for user login
exports.postLogin = passport.authenticate('local', {
    failureRedirect: '/login', // Redirect on login failure
    successRedirect: '/profile', // Redirect on successful login
  
});

// Logout route
exports.postlogOut = (req, res) => {
    req.logout();
    res.redirect('/');
}

// Sign up
exports.getSignUp = (req, res, next) => {
    res.render('signUp', {
        path: '/user/signUp',
        pageTitle: 'Sign Up'
    });
}

exports.postSignUp = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (user) {
            // User already exists
            return res.status(400).send('User already exists');
        }
        await User.create(req.body);
        console.log("New user created");
        res.redirect('/login');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

exports.getUserProfile = (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user) {
        return res.status(401).send('Unauthorized'); // User is not authenticated
    }

    const userId = req.user.id; // Get the user ID from the authenticated user's session

    // Fetch user data from the database based on the userId
    User.findByPk(userId)
        .then(user => {
            if (!user) {
                // If user not found, handle accordingly (redirect, render an error page, etc.)
                return res.status(404).send('User not found');
            }

            // Render the user profile page with user data
            res.render('profile', {
                pageTitle: 'User Profile',
                user: user,
                path: '/profile'
            });
        })
        .catch(err => {
            console.error('Error fetching user data:', err);
            res.status(500).send('Internal Server Error');
        });
};

