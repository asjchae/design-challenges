var everyauth = require('everyauth');


/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res) {

// Facebook
everyauth.facebook
  .appId(process.env.FB_ID)
  .appSecret(process.env.FB_SECRET)
  .handleAuthCallbackError( function (req, res) {
    // If a user denies your app, Facebook will redirect the user to
    // /auth/facebook/callback?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
    // This configurable route handler defines how you want to respond to
    // that.
    // If you do not configure this, everyauth renders a default fallback
    // view notifying the user that their authentication failed and why.
  })
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
    // find or create user logic goes here
  })
  .redirectPath('/');

    // req.session.url = '/fetch';
	// res.render('login', {title: "Sign In"});
};