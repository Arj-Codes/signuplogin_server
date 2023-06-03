require("dotenv").config();
require("./db/connect");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;
const userRoute = require("./Routes/user");

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoute);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Running at PORT ${PORT}`);
});
