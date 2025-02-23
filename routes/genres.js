// This will handle the routes that will display genres and painting genres
const express = require('express');
const supabase = require('../config/supabase');
const errHandle = require('../util/error_handling');
const router = express.Router();

// Returns all the genres
router.get('/', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('genres')
        .select(`
            genreId, genreName, 
            eras (*),
            description, wikiLink`)
        .order('genreId', { ascending: true });

        //Error handling and message display
        if (error) {
            return errHandle(res,error);
        }
        if (!data) {
            return res.status(404).json({ message: 'No genres found.' });
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns just the specified genre
router.get('/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('genres')
        .select(`
            genreId, genreName, 
            eras (*),
            description, wikiLink`)
        .eq('genreId', req.params.ref)
        .order('genreId', { ascending: true });

        //Error handling and message display if there is no data or data with that genre ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ message: `No genre with ID : ${req.params.ref}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns the genres used in a given painting
router.get('/painting/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintinggenres')
        .select(`
            genres(genreName)`)
        .eq('paintingId', req.params.ref)
        .order('genreName', {referencedTable: 'genres', ascending: true });

        //Error handling and message display if there is no data or data with that genre ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings with genre ID : ${req.params.ref}`});
        }
        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

module.exports = router;