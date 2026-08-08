const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API is running'));

const tablesRoute = require('./routes/tables');
app.use('/tables', tablesRoute);

const authRoute = require('./routes/auth');
app.use('/auth', authRoute);

const reservationsRoute = require('./routes/reservations');
app.use('/reservations', reservationsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
