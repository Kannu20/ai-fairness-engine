const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        console.log("Google Profile:", JSON.stringify(profile, null, 2));

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email not found"), null);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {

          user = await User.findOne({ email });

          if (user) {

            user.googleId = profile.id;
            user.lastLogin = Date.now();

            await user.save();

          } else {

            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              avatar: profile.photos?.[0]?.value || "",
              isVerified: true,
              lastLogin: Date.now(),
            });
          }

        } else {

          user.lastLogin = Date.now();
          await user.save();
        }

        return done(null, user);

      } catch (err) {

        console.error("GOOGLE AUTH ERROR:", err);

        return done(err, null);
      }
    }
  )
);

module.exports = passport;
