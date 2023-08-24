const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/cartDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));

const cartRoutes = require("./routes/cartRoutes");

app.use("/api", cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
