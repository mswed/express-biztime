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
        const results = await db.query(`SELECT * FROM invoices as inv JOIN companies as comp ON inv.comp_code = comp.code WHERE id = $1;`, [id]);
        if (results.rows.length === 0) {
            return next(new ExpressError(`Can not find a invoice with id of ${id}`, 404))
        }
        const data = results.rows[0];

        return res.json({
            invoice: {
                id: data.id,
                company: {
                    code: data.code,
                    name: data.name,
                    description: data.description
                },
                amt: data.amt,
                paid: data.paid,
                add_date: data.add_date,
            }
        })
    } catch (e) {
        next(e)
    }
})

// Create a new invoice
router.post('/', async (req, res, next) => {
    try {
        const {comp_code, amt} = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`, [comp_code, amt])
        return res.status(201).json({invoice: results.rows[0]})
    } catch (e) {
        next(e)
    }
})

// Update an invoice by id
router.put('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const {amt} = req.body;
        const results = await db.query(`UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING *`, [amt, id])
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