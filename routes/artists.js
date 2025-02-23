// This fille handles the routes that will display artists

//Required modules
const express = require('express');
const supabase = require('../config/supabase');
const errHandle = require('../util/error_handling');
const router = express.Router();

// Returns all artist
router.get('/', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('artists')
        .select('*');

        //Error handling and message display
        if (error) {
            return errHandle(res,error);
        }
        if (!data) {
            return res.status(404).json({ message: 'No artists found.' });
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns the specified artist based on their ID
router.get('/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('artists')
        .select('*')
        .eq('artistId', req.params.ref);

        //Error handling and message display if there is no data or data with that ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No artist with ID : ${req.params.ref}`});
        }
        res.json(data);
    }catch (err) {
        errHandle(res,err);
    }
});

// Returns the artists whose nationality begins with the provided substring
router.get('/country/:substring', async (req, res) => {
    try{
        const {substring} = req.params;
        const {data, error} = await supabase
        .from('artists')
        .select('*')
        .ilike('nationality', `${substring}%`);

        //Error handling and message display if there is no data or data with that country substring
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No artist in the country beginning with : ${req.params.substring}`});
        }
        res.json(data);
    }catch (err) {
        errHandle(res,err);
    }
}); 

// Returns the artist whose name (case insensitive) begins with the provided substring
router.get('/search/:substring', async (req, res) => {
    try{
        const {substring} = req.params;
        const {data, error} = await supabase
        .from('artists')
        .select('*')
        .ilike('lastName', `${substring}%`)
        .order('lastName', { ascending: true });

        //Error handling and message display if there is no data or data with that painting title
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No artist with last name beggining with : ${substring}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

module.exports = router;