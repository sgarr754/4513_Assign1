// Required modules 
const express = require('express');
const supabase = require('./config/supabase');
const erasRoutes = require('./routes/eras');
const artistsRoutes = require('./routes/artists');
const galleriesRoutes = require('./routes/galleries');
const paintingsRoutes = require('./routes/paintings');
const genresRoutes = require('./routes/genres');
const countsRoutes = require('./routes/counts');

const app = express();
const port = 8080; //defining the post where the server will listen

//middle ware to parse JSON request
app.use(express.json()); 

// API routes
app.use('/api/eras', erasRoutes);
app.use('/api/artists', artistsRoutes);
app.use('/api/galleries', galleriesRoutes);
app.use('/api/paintings', paintingsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/counts', countsRoutes);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
})