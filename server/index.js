import express from "express"; //web framework for our Node.js
import bodyParser from "body-parser"; //parse the request body from incoming HTTP requests and extract data from it.
import mongoose from "mongoose"; // It's helps us to connect to our MongoDB database and perform various operations like create, read, update and delete
import cors from "cors"; // Cross-Origin Resource Sharing, allowing requests from different domains to access the resources on our server.
import dotenv from "dotenv"; // It loads environment variables from a .env file into process.env
import multer from "multer"; // It's a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
import helmet from "helmet"; // add security-related HTTP headers to the responses, making the Express app more secure.
import morgan from "morgan";// used for logging HTTP requests and responses, making it easier to debug and analyze the application.
import path from "path"; // for working with file and directory paths
import {fileURLToPath} from "url";
import {register} from "./controllers/auth.js";
import User from "./models/User.js";


// allow us to properly resolve the path to the current file, regardless of where it is run.


//---This is used when you only use type: module in your package.json---//
const __filename = fileURLToPath(import.meta.url); // Getting the current filename of the current module file using fileURLToPath function
const __dirname = path.dirname(__filename);// Getting the current directory name of the current module file using dirname function


//---configuring dotenv---//
dotenv.config(); // loads environment variables from a .env file into process.env


//---configuring express---//
const app = express();// initialize express


//---configuring Security & Data Parsing---//
app.use(express.json());//we are telling express to use json as we are sending json data to our server

//https://dev.to/codexam/how-to-use-helmetjs-to-secure-your-nodejs-express-app-4b1l
//https://codexam.hashnode.dev/how-to-use-helmetjs-to-secure-your-nodejs-express-app
app.use(helmet());//it adds some security headers to our http response headers which gets sent to the client


/*By default, Helmet sets 12 HTTP headers that can improve your security.
 However, you can also configure or disable each header individually
 using options passed to the helmet() function or to specific middleware functions.
 For example, if you want to set the Cross-Origin-Resource-Policy header to “cross-origin”*/
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"})); //sets the Cross-Origin-Resource-Policy header to "cross-origin" & tells browsers to block resources from other origins unless they explicitly allow it
app.use(morgan("common"));//used for logging HTTP requests and responses, making it easier to debug and analyze the application.


//limiting the size of the body to 30mb because we are going to be uploading images to our server and we want to be able to upload images that are quite large
//extended: true allows us to pass nested objects in the url
app.use(bodyParser.json({limit: "30mb", extended: true}));//parse the json data from incoming HTTP requests and extract data from it.
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));//parse the urlencoded data (abc+xyz=abc xyz) from incoming HTTP requests and extract data from it.


app.use(cors());//invoking cors to allow requests from different domains to access the resources on our server.


//---configuring local file storage---//

/* In the future, we will use amazon s3 bucket to store our images, but for now we will store them in our local machine */
app.use("/assets", express.static(path.join(__dirname, "public/assets")));//serving static files from the public folder


////We will use s3 bucket to store our images but for now we will store them in our local machine
// import s3Proxy from "s3-proxy";
// app.use('/assets', s3Proxy({
//     bucket: 'your-bucket-name', // The name of your S3 bucket
//     prefix: 'your-s3-prefix', // The optional prefix for your S3 objects
//     accessKeyId: 'your-access-key-id', // Your AWS access key ID
//     secretAccessKey: 'your-secret-access-key', // Your AWS secret access key
//     overrideCacheControl: 'max-age=100000' // The optional cache control header
// }));


//---FILE STORAGE CONFIGURATION---//
//https://dev.to/codexam/how-to-use-multer-to-upload-files-in-nodejs-and-express-2a1a
//https://codexam.hashnode.dev/how-to-use-multer-to-upload-files-in-nodejs-and-express
// This defines a storage engine for storing files on disk
const storage = multer.diskStorage({

    // The destination directory for storing files
    destination: function (req, file, cb) {

        // The cb function is a callback that takes two parameters: an error and a path
        // The null argument means there is no error
        // The "public/assets" argument means the files will be stored in this directory
        cb(null, "public/assets");
    },

    // This defines the file name for storing files
    filename: function (req, file, cb) {

        // The cb function is a callback that takes two parameters: an error, and a name
        // The null argument means there is no error
        // The file.originalname argument means the files will be stored with their original names
        cb(null, file.originalname);
    },
});

// This creates a multer instance with the storage engine
const upload = multer({storage});


//---configuring routes---//
//**-Routes for files-**//
//when someone hits the /upload endpoint, we will run the register function which will register the user after checking if the user already exists
//we are using the upload.single middleware to upload a single file
app.post("/upload", upload.single("file"), register);


/*---configuring mongoose---*/
const PORT = process.env.PORT || 5001; //getting the port from the .env file or using port 5000

//useNewUrlParser is used to parse the url string properly and useUnifiedTopology is used to use the new server discovery and monitoring engine
mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    app.listen(PORT, () => console.log(`⚡ Server running on port: ${PORT} ⚡ `));
}) //connecting to the database
    .catch((error) => console.log(`${error} did not connect`)); //catching any errors that occur while connecting to the database