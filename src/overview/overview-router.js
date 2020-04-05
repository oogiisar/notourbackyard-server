const express = require('express');
const path = require('path');
const OverviewService = require('./overview-service');

const overviewRouter = express.Router();


overviewRouter
    .route('/:country')
    .get((req, res, next) => {
        if(req.params.country === 'World') {
            const knexInstance = req.app.get('db')
            OverviewService.getWorld(knexInstance)
            .then(world  => {
                res.status(200).json(world)
            })
        } else if(req.params.country === 'top') {
            const knexInstance = req.app.get('db')
            OverviewService.getTop(knexInstance)
            .then(top  => {
                res.status(200).json(top)
            })
        } else {
            const knexInstance = req.app.get('db')
            OverviewService.getCountry(knexInstance,  req.params.country)
            .then(country  => {
                res.status(200).json(country)
            })
        }
    })
overviewRouter
    .route('/:country/:region')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
            OverviewService.getRegion(knexInstance,  req.params.country, req.params.region)
            .then(region  => {
                res.status(200).json(region)
            })
    })

module.exports = overviewRouter;