import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User from './models/user.model.js'; // Assuming you have a User model for MongoDB
import { Cookie } from 'express-session';
// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user.id);  // Store user ID in session
});

// Deserialize user information from the session
passport.deserializeUser((id, done) => {
  User.findById(id)  // Retrieve user by ID from the database
    .then(user => {
      done(null, user);  // Pass the user object to req.user
    });
});

passport.use(
  new GoogleStrategy({
    clientID: process.env.PASSPORT_CLIENT_ID,
    clientSecret: process.env.PASSPORT_CLIENT_SECRET,
    callbackURL: process.env.PASSPORT_CALLBACK_URL,
    passReqToCallback:true
  },
    
  async function(accessToken,request, refreshToken, profile, done) {
      // Check if user already exists in our db
      // const existingUser = await User.findOne({ googleId: profile.id });
      // if (existingUser) {
        // User already exists
        // console.log(profile);
        // return done(null, profile);
      // }

      // If not, create a new user in our db
      // const newUser = await new User({ googleId: profile.id }).save();
      // done(null, newUser);


      try {
        let user = await User.findOne({ googleId: profile.id });
  
        if (!user) {
          user = new User({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            profile: profile.photos[0].value,
            password: ""
          });
          await user.save();
        }
        else{
          let token = await user.generateAccessToken()
          let data = { userData: user, token: token };
          console.log("data",data);
          // return res.status(SUCCESS).send(sendResponse(true,"Login Successfully With Google",data))
          // sess.setItem('g-token',data)
          
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    })
);

