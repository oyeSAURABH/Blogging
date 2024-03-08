import express from "express";
const app = express();
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./app/models/index.js";
import router from "./routes/index.js";
import session from "express-session";
const PORT = process.env.PORT;

//  to get __dirname since its not defined in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
app.use(express.json());
app.use(express.static("uploads"));
app.use(
  session({
    key: process.env.userid,
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.header("Cache-Control", "no-store");
  next();
});

app.use("/api/v1", router);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/app/views"));

// routes
app.get("/", function (req, res) {
  res.render("pages/index", { user: req?.session?.user || null });
});
app.get("/login", function (req, res) {
  if (req?.session?.authorized) return res.redirect("/");
  res.render("pages/login");
});
app.get("/register", function (req, res) {
  if (req?.session?.authorized) res.redirect("/");
  res.render("pages/register");
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
app.get("/blog/create", function (req, res) {
  if (req?.session?.authorized)
    return res.render("pages/createBlog", { user: req.session.user || null });
  res.redirect("/login");
});
app.get("/blog/auditlogs", function (req, res) {
  if (req?.session?.user?.isAdmin)
    return res.render("pages/auditLogs", { user: req.session.user || null });
  res.redirect("/login");
});
app.get("/blog/:id", function (req, res) {
  res.render("pages/blog", { user: req.session.user || null });
});
app.get("/user/edit", function (req, res) {
  if (req?.session?.user?.isAdmin)
    return res.render("pages/editUser", { user: req.session.user || null });
  res.redirect("/login");
});
app.get("*", (req, res) => {
  res.render("pages/notfound");
});

//start server
sequelize
  .sync()
  .then(() => {
    console.log("All Tables are created");
    app.listen(PORT, () => {
      console.log(`Running on http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
