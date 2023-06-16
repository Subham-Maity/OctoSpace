//importing mongoose
import mongoose from 'mongoose';

//creating a function to connect to the database
const connectDB = async () => {
    try {
        //getting the connection url from the .env file
        const connectionURL = process.env.CONNECTION_URL;

        //connecting to the database with options
        await mongoose.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true});

        //logging a success message
        console.log('🔥 Database connected successfully 🔥');
    } catch (error) {
        //logging an error message
        console.error(`❌ Database connection failed: ${error.message} ❌`);
        //exiting the process with failure code
        process.exit(1);
    }
};

//exporting the connectDB function
export default connectDB;
