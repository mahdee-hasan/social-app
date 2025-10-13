const arrangeAuthError = (error) => {
  // Get the Firebase error code
  const errorCode = error.code;
  const parsedError = {};
  // Use a switch statement to handle specific error codes
  switch (errorCode) {
    case "auth/invalid-credential":
      parsedError.general = "invalid credentials";
      break;
    case "auth/invalid-email":
      parsedError.email = "Please enter a valid email address.";
      break;
    case "auth/user-disabled":
      parsedError.general =
        "This account has been disabled. Contact support for help.";
      break;
    case "auth/email-already-in-use":
      parsedError.general = "the email has been taken";
      break;
    case "auth/too-many-requests":
      parsedError.general =
        "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.";
      break;
    case "auth/network-request-failed":
      parsedError.general = "please check the connection and try again";
      break;
    default:
      // Handle unexpected or generic errors
      parsedError.general =
        "An unexpected error occurred. Please try again." + error.message;
  }

  return parsedError;
};

export default arrangeAuthError;
