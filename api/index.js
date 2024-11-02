const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const multer = require("multer");


dotenv.config();

const PORT = process.env.PORT;

const mongoose = require("mongoose");

//connect DB

mongoose
  .connect(process.env.MONGOOSEDB_RUL)
  .then(() => console.log("db connected"))
  .then((err) => {
    err;
  });

const databaseSeeder = require("./databaseSeeder");
const userRoute = require("./routes/User");
const productRoute = require("./routes/Product");
const orderRoute = require("./routes/Order");


const allowedOrigins = [
  "https://ecommerce-gemstone-xd1v-n92tr71zq-p4ul4fs-projects.vercel.app",
  "https://ecommerce-gemstone-xd1v.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true 
};

app.use(cors(corsOptions));



app.use(express.json());

//middleware para subir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//database seeder router
app.use("/api/seed", databaseSeeder);


//api/users/login
app.use("/api/users", userRoute);

//route for products
app.use("/api/products", productRoute);

//route for orders
app.use("/api/orders", orderRoute);

// const cors = require('cors');
// app.use(cors());


//paypal payment api for client key
app.use("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Configuración de multer para guardar archivos en el directorio 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Guarda en el directorio 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  }
});

const upload = multer({ storage: storage });

// Ruta para subir una imagen
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ message: 'Imagen subida exitosamente', imageUrl: `/uploads/${req.file.originalname}` });
});

// Servir archivos estáticos (esto permite que las imágenes sean accesibles públicamente)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT || 3000, () => {
  console.log(`server listening on port ${PORT}`);
});



//mongodb+srv://paulaferreyra24:<l4uNgLZdiJH6uJlb>@cluster0.gmhce.mongodb.net/react-node-app
