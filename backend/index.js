import express from 'express';
import cors from 'cors'
import dbRoutes from "./app/routes/db.routes.js";
import tradingRoutes from "./app/routes/trading.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/db', dbRoutes);
app.use('/trading', tradingRoutes);

const PORT = 3001;

app.listen(PORT, (err) => {
    console.log(`Server is running on port ${PORT}`);
});