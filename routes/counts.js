// This will handle the routes that will display artists
const express = require('express');
const supabase = require('../config/supabase');
const errHandle = require('../util/error_handling');
const router = express.Router();

// Returns the genre name and the number of paintings for each genre, sorted by the number of paintings (fewest to most)
router.get('/genres', async (req, res) => {
    try{
    const {data, error} = await supabase
    .from('paintinggenres')
    .select(`
        genres(genreName),
        genreId`);

    //Error handling and message display
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No genres found' });
    }

    //If there a genreName comes up and there is no count initialized, it will initialize it
    //Once initialized it will add 1 and count how many times the genreName comes up.
    const genreCount = data.reduce((acc, elem) =>{
        const genreName = elem.genres.genreName;
        if (!acc[genreName]) {
            acc[genreName] = 0;
        }
        acc[genreName] += 1;
        return acc;
    }, {});

    //using Object.entries will convert this into an array and will sort it from fewest to most
    const formattedData = Object.entries(genreCount)
        .map(([genreName, paintCount]) =>({ genreName, paintCount }))
        .sort((a, b) => a.paintCount - b.paintCount);

    res.json(formattedData);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns the artist name (first name space last name) and the number of paintings for each artist, sorted by the number of paintings (most to fewest)
router.get('/artists', async (req, res) => {
    try{
    const {data, error} = await supabase
    .from('artists')
    .select(`
        firstName, lastName,
        paintings!inner(artistId)`);
    
    //Error handling and message display
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No artists or paintings found' });
    }

    //this will format the data first and last name of the artist, and the number of paintings they have
    const formattedData = data.map(artist => ({
        artistName: `${artist.firstName} ${artist.lastName}`,
        paintingCount: artist.paintings.length
    }));

    //this will take the formatted data and sort them from highest to lowest
    formattedData.sort((a, b) => b.paintingCount - a.paintingCount);

    res.json(formattedData);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns the genre name and the number of paintings for each genre,
// sorted by the number of paintings (most to least) for genres having
// over some set number of paintings
router.get('/topgenres/:ref', async (req, res) => {
    try{
        const minPainting = parseInt(req.params.ref);
        
        const {data, error} = await supabase
        .from('paintinggenres')
        .select(`
            genres(genreName),
            genreId`);
        
        //Error handling and message display
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (!data || minPainting === 0) {
            return res.status(404).json({ message: 'No genres found for specified set number of paintings' });
        }
        if (minPainting < 0){
            return res.status(404).json({ message: 'Number of paintings is invalid. Must be a number equal or greater than 0' });
        }
 
        //If there a genreName comes up and there is no count initialized, it will initialize it
        //Once initialized it will add 1 and count how many times the genreName comes up.
        const genreCount = data.reduce((acc, elem) =>{
            const genreName = elem.genres.genreName;
            if (!acc[genreName]) {
                acc[genreName] = 0;
            }
            acc[genreName] += 1;
            return acc;
        }, {});

        //using Object.entries will convert this into an array and will sort it from most to fewest
        //the .filter will filter our the paintCount if it is less than the ref in the endpoint
        const formattedData = Object.entries(genreCount)
            .map(([genreName, paintCount]) =>({ genreName, paintCount }))
            .filter(({paintCount}) => paintCount > minPainting)
            .sort((a, b) => b.paintCount - a.paintCount);

        //This is an error message if there is no paintings that meet the minimum paintCount
        if(formattedData.length === 0){
            return res.status(404).json({ message: `No paintings found with more than ${minPainting} paintings.` });
        } 

        res.json(formattedData);
    } catch (err) {
        errHandle(res,err);
    }
});

module.exports = router;