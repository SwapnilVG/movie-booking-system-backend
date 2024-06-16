import app from "./app.js";
import dbconnection from "./config/dbConnection.js";
const PORT = process.env.PORT || 5000;


app.listen(PORT, async() => {
  await dbconnection();
  console.log(`Server running on port ${PORT}`);
});

