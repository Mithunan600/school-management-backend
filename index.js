const express = require('express');
const schoolRoutes = require('./routes/schoolroute');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/school", schoolRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

