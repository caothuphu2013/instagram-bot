## About this Repo

A full fledged Instagram bot that will: Sign up user with email, onboard, authenticate with Instagram, and subscribe user with Stripe payments. Features include ability to follow, like, and comment other Instagram users based on targeting parameters given by user.

The application includes a dashboard full of components for managing your Instagram automation, including a highlight of Instagram account stats, a full robust statistics component to track progress, a billing and account component to manage billing and account (obviously), a targeting component for user to input parameters for automation, and that automation settings itself which allows to choose follow, like, comment, etc.

Built using these languages and services:

Front End: React.js, Javascript, Redux

Back End: Node, Express.js, Passport.js, Mongoose, Mongo DB,

API's: Instagram API, Stripe API

### Getting started

1. cd into root and run `npm install`

3. cd into client and run `npm install`

3. From root run `npm run dev`

You will be presented with a blank landing page. You could start the sign up flow, but since the app was never able to leave sandbox mode it is not able to connect anyones Instagram account. Unfortunately upon finishing this application [Instagram closed down their API indefinitely](https://www.instagram.com/developer/changelog/) so development has been indefinitely halted as well.
