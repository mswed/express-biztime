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
        const company = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        if (company.rows.length === 0) {
            return next(new ExpressError(`Can not find a company with code of ${code}`, 404))
        }
        const foundInvoices = await db.query(`SELECT * FROM invoices WHERE comp_code = $1 ORDER BY id`, [code])
        const invoices = foundInvoices.rows.map((value, index, array) => {
            return value.id
        })



        return res.json({company: {...company.rows[0], invoices}})
    } catch (e) {
        next(e)
    }
})

// Create a new company
router.post('/', async (req, res, next) => {
    try {
        const {code, name, description} = req.body;
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`, [code, name, description])
        return res.status(201).json({company: results.rows[0]})
    } catch (e) {
        next(e)
    }
})

// Update a company by code
router.put('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;
        const {name, description} = req.body;
        const results = await db.query(`UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *`, [name, description, code])
        if (results.rows.length === 0) {
            return next(new ExpressError(`Can not update company with code of ${code}`, 404))
        }

        return res.json({company: results.rows[0]})
    } catch (e) {
        next(e)
    }
})

// Delete a company by id
router.delete('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;
        const valid = await db.query(`SELECT * FROM companies WHERE code = $1`, [code])
        if (valid.rows.length > 0) {
            await db.query(`DELETE FROM companies WHERE code = $1`, [code])
            return res.json({status: 'deleted'})
        } else {
            throw new ExpressError(`Can not delete company with code of ${code}`, 404)

        }


    } catch (e) {
        next(e)
    }
})

module.exports = router;