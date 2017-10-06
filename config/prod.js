module.exports = {
  instagramClientID: process.env.INSTAGRAM_CLIENT_ID,
  instagramClientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  globalRateLimit: 5000
}
