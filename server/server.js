const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => res.send('API is running'));

const tablesRoute = require('./routes/tables');
app.use('/tables', tablesRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));