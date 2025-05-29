export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true, // Set httpOnly to true
    };
  
    console.log('login sucessful'. token, user);
    
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user: {
        ...user.toObject(), // Convert the user to plain JavaScript object, so can add properties to it
        token, // Add the token to the user object
      },
      message,
      // token,
    });
  };
  