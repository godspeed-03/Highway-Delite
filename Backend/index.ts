import connectDB from "./src/DB/ConnectToDB"; // Adjust based on your actual TypeScript setup
import app from "./app";

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on : ${PORT}`);
    });
  })
  .catch((err: String) => {
    console.error(`Error occurred at server starting: ${err}`);
  });
