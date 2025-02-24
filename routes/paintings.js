// This will handle the routes that will display paintings
const express = require('express');
const supabase = require('../config/supabase');
const errHandle = require('../util/error_handling');
const router = express.Router();

// returns all the paintings
router.get('/', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .order('title', { ascending: true });

        //Error handling and message display
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No paintings found.' });
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// returns all paintings, sorted by title or yearOfWork
router.get('/sort/:sortBy(title|year)', async (req, res) => {
    try{
        const {sortBy} = req.params; //created sortBy parameter with title or year and then use ternary operator for if statement
        const sort = sortBy === 'title' ? 'title' : 'yearOfWork'
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .order(sort, { ascending: true });
        
        //Error handling and message display
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings found.`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns just the painting with specific ID
router.get('/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .eq('paintingId', req.params.ref)
        .order('title', { ascending: true });

        //Error handling and message display if there is no data or data with that painting ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings with ID : ${req.params.ref}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns the paintings whose title (case insensitive) contains the provided substring
router.get('/search/:substring', async (req, res) => {
    try{
        const {substring} = req.params;
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .ilike('title', `%${substring}%`)
        .order('title', { ascending: true });

        //Error handling and message display if there is no data or data with that painting title
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings with title beggining with : ${substring}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns the paintings between two years (include the paintings in the provided years), ordered by yearOfWork
router.get('/years/:start/:end', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .gte('yearOfWork', req.params.start)
        .lte('yearOfWork', req.params.end)
        .order('yearOfWork', { ascending: true });

        //Error handling and message display if year input is invalid or no data for specific years painting was created
        if (error) {
            return errHandle(res,error);
        }
        if (parseInt(req.params.end) < parseInt(req.params.start)){
            return res.status(404).json({error: `Invalid input. End year cannot be less than start year`});
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings between the years ${req.params.start} and ${req.params.end} `});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns all the paintings in a given gallery ID
router.get('/galleries/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .eq('galleryId', req.params.ref)
        .order('title', { ascending: true });

        //Error handling and message display if there is no data or data with that gallery ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings in galleries starting with ${req.params.ref} `});
        }
        
        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
}); 

// Returns all the paintings by a given artist ID
router.get('/artist/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .eq('artistId', req.params.ref)
        .order('title', { ascending: true });

        //Error handling and message display if there is no data or data with that artist ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings  with artists starting with ${req.params.ref} `});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
}); 

// Returns all the paintings by artists whose nationality begins with the provided substring
router.get('/artist/country/:ref', async (req, res) => {
    try{
        const {ref} = req.params;
        const {data, error} = await supabase
        .from('paintings')
        .select(`
            paintingId, 
            artists (*),
            galleries (*),
            imageFileName, title,
            shapeId, museumLink, accessionNumber, copyrightText, description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink,
            googleDescription, wikiLink, jsonAnnotations`)
        .ilike('artists.nationality', `${ref}%`)
        .order('title', { ascending: true });

        //Error handling and message display if there is no data or data with that artists nationality
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings with artists whose nationality starts with ${req.params.ref}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
}); 

// Returns all the paintings for a given genre
router.get('/genre/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintinggenres')
        .select(`
            paintings!inner(paintingId, title, yearOfWork)`)
        .eq('genreId', req.params.ref);
        // .order('yearOfWork', { referencedTable: 'paintings', ascending: true });

        //the data will be grabbed first and then using .sort, it will sort the data from lowest to highest
        data.sort((a, b) => a.paintings.yearOfWork - b.paintings.yearOfWork);

        //Error handling and message display if there is no data or data with that genre ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings with the genre: ${req.params.ref}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

// Returns all the paintings for a given era
router.get('/era/:ref', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('paintinggenres')
        .select(`
            genres!inner(eraId),
            paintings!inner(paintingId, title, yearOfWork)`)
        .eq('genres.eraId', req.params.ref)
        .order('yearOfWork', { referencedTable: 'paintings', ascending: true });

        //Error handling and message display if there is no data or data with that era ID
        if (error) {
            return errHandle(res,error);
        }
        if (!data || data.length === 0){
            return res.status(404).json({error: `No paintings with the genre: ${req.params.ref}`});
        }

        res.json(data);
    } catch (err) {
        errHandle(res,err);
    }
});

module.exports = router;