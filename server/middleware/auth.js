import jwt from 'jsonwebtoken';// for generating token for authentication

// Defining a middleware function for verifying tokens
export const verifyToken = async (req, res, next) => {
    try {
        // Getting the token from the request header means from the client side, we grab the authorization token when user login
        let token = req.header("Authorization");
        // console.log(token)

        // Checking if the token is provided
        if (!token) {
            // If no token is provided, sending back a 403 status code and a message
            return res.status(403).send("Access denied");
        }

        // Checking if the token starts with "Bearer"
        //it set in the client side in the header of the request
        if (token.startsWith("Bearer ")) {
            // If yes, removing the "Bearer" part and any leading spaces
            token = token.slice(7, token.length).trimLeft();//trimLeft() means remove any leading spaces from the token and slice(7, token.length) means remove the first 7 characters from the token
            // console.log(token)
        }

        // Verifying the token using jwt, using the secret key from the environment variables as an argument
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(verified)

        // Adding the verified user ID to the request object
        req.user = verified;

        // Calling the next middleware function to proceed to the route handler if the token is valid and verified successfully
        next();
    } catch (err) {
        // Handling any errors and sending back a 500 status code and the error message as JSON
        res.status(500).json({message: err.message});
    }
}
