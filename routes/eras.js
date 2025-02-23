//// This will handle the routes that will display eras
const express = require('express');
const supabase = require('../config/supabase');
const errHandle = require('../util/error_handling');
const router = express.Router();

// Return all eras
//If there is an error, display message
router.get('/', async (req, res) => {
    try{
        const {data, error} = await supabase
        .from('eras')
        .select('*')

        //Error handling and message display
        if (error) {
            return errHandle(res,error);
        }
        if (!data) {
            return res.status(404).json({ message: 'No eras found.' });
        }
        res.json(data);
    } catch (err) {
        errHandle(res,err)
    }
}); 

module.exports = router;