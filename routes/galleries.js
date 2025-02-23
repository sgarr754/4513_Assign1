// This will handle the routes that will display galleries
const express = require('express');
const supabase = require('../config/supabase');
const errHandle = require('../util/error_handling');
const router = express.Router();

// Return all galleries
router.get('/', async (req, res) => {
    try{    
        const {data, error} = await supabase
        .from('galleries')
        .select('*');

        //Error handling and message display
        if (error) {
            return errHandle(res,error);
        }
        if (!data) {
            return res.status(404).json({ message: 'No galleries found.' });
        }
    res.json(data);
    } catch (err) {
            errHandle(res,err);
    }
}); 

// Returns specified gallery from the ID
router.get('/:ref', async (req, res) => {
    try{
    const {data, error} = await supabase
    .from('galleries')
    .select('*')
    .eq('galleryId', req.params.ref);

    //Error handling and message display if there is no data or data with specific ID
    if (error) {
        return errHandle(res,error);
    }
    if (!data || data.length === 0) {
        return res.status(404).json({ error: `No paintings found for the gallery with ID: ${req.params.ref} `});
    }

    res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
}); 

// Returns all gallery fields that belongs to the country with the provided substring
router.get('/country/:substring', async (req, res) => {
    try{
        const {substring} = req.params;
        const {data, error} = await supabase
        .from('galleries')
        .select('*')
        .ilike('galleryCountry', `${substring}%`);

        //Error handling and message display if there is no data or data with specific substring
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No galleries in the country beginning with : ${substring}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
}); 

module.exports = router;