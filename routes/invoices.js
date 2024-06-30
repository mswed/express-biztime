const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

// Get list of invoices
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({invoices: results.rows})
    } catch (e) {
        next(e)
    }


})

// Get invoice by id
router.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        if (results.rows.length === 0) {
            return next(new ExpressError(`Can not find a invoice with id of ${id}`, 404))
        }

        return res.json({invoice: results.rows[0]})
    } catch (e) {
        next(e)
    }
})

// Create a new invoice
router.post('/', async (req, res, next) => {
    try {
        const {id, name, description} = req.body;
        const results = await db.query(`INSERT INTO invoices (id, name, description) VALUES ($1, $2, $3) RETURNING *`, [id, name, description])
        return res.status(201).json({invoice: results.rows[0]})
    } catch (e) {
        next(e)
    }
})

// Update a invoice by id
router.put('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, description} = req.body;
        const results = await db.query(`UPDATE invoices SET name = $1, description = $2 WHERE id = $3 RETURNING *`, [name, description, id])
        if (results.rows.length === 0) {
            return next(new ExpressError(`Can not update invoice with id of ${id}`, 404))
        }

        return res.json({invoice: results.rows[0]})
    } catch (e) {
        next(e)
    }
})

// Delete a invoice by id
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const valid = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id])
        if (valid.rows.length > 0) {
            await db.query(`DELETE FROM invoices WHERE id = $1`, [id])
            return res.json({status: 'deleted'})
        } else {
            throw new ExpressError(`Can not delete invoice with id of ${id}`, 404)

        }


    } catch (e) {
        next(e)
    }
})

module.exports = router;