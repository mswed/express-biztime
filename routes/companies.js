const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

// Get list of companies
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies: results.rows})
    } catch (e) {
        next(e)
    }


})

// Get company by id
router.get('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        if (results.rows.length === 0) {
            return next(ExpressError(`Can not find a company with code of ${code}`))
        }

        return res.json({company: results.rows[0]})
    } catch (e) {
        next(e)
    }
})

// Create a new company
router.post('/', async (req, res, next) => {
    try {

    } catch (e) {
        next(e)
    }
})

// Update a company by id
router.put('/:id', async (req, res, next) => {
    try {

    } catch (e) {
        next(e)
    }
})

// Delete a company by id
router.delete('/:id', async (req, res, next) => {
    try {

    } catch (e) {
        next(e)
    }
})

module.exports = router;