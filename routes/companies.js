const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

// Get list of companies
router.get('/', async (req, res, next) => {
    const results = await db.query(`SELECT * FROM companies`);
    res.json({companies: results.rows})

})

// Get company by id
router.get('/:id', async (req, res, next) => {

})

// Create a new company
router.post('/', async (req, res, next) => {

})

// Update a company by id
router.put('/:id', async (req, res, next) => {

})

// Delete a company by id
router.delete('/:id', async (req, res, next) => {

})

module.exports = router;