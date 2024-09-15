import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: `${process.env.CLIENT_URL}`, 
  credentials: true,
}));
app.use(cookieParser());
app.use( express.json( { limit: "16kb" } ) );
app.use( express.urlencoded( {
  extended: true,
  limit: "16kb"
} ) );

// app.get( "/", ( req, res ) => {
//   res.status( 200 ).json( "Server Running successfully" );
// } );

// (err, req, res, next)

// routes
import router from "./src/routes/User.routes";
import errorHandler from "./src/middleware/error.middleware";

app.use( "/api/v1/user", router );

app.use( errorHandler );

export default app;
