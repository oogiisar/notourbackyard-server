const express = require('express');
const path = require('path');
const UsersService = require('../users/users-service');
const CleanupsService = require('./cleanups-service');
const { requireAuth } = require('../middleware/jwt-auth');

const cleanupsRouter = express.Router();
const jsonBodyParser = express.json();


cleanupsRouter
    .route('/:id')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        CleanupsService.getCleanups(knexInstance, req.params.id)
        .then(cleanups  => {
            res.json(cleanups)
        })
    })

    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { country, region, type_of_trash, quantity } = req.body
        const newCleanup = { country, region, type_of_trash, quantity}
        let RegionId = ''

        for (const [key, value] of Object.entries(newCleanup))
            if (value == null)
                return res.status(400).json({
                error: `Missing '${key}' in request body`
                })
        
        UsersService.hasCountryWithCountryName(
            req.app.get('db'),
            country
        )
        
        .then(hasCountryWithCountryName => {
            if (!hasCountryWithCountryName)  {
                return UsersService.insertCountry(
                    req.app.get('db'),
                    country
                )
            .then(
                UsersService.getCountryId(
                    req.app.get('db'),
                    country
                )
            )
            
                .then( countryId =>
                    UsersService.insertRegion(
                        req.app.get('db'),
                        countryId.id,
                        region
                    )
                    .then(regionId => 
                        CleanupsService.insertCleanup(
                            req.app.get('db'),
                            {
                                location: regionId.id,
                                user_name: req.params.id,
                                type_of_trash: type_of_trash,
                                quantity: quantity
                            }
                        )
                    )
                    .then(
                        res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${req.params.id}`))
                    )   
                )
                .catch(next)
            } else {
                UsersService.getCountryId(
                    req.app.get('db'),
                    country
                )
                .then(countryId => 
                    UsersService.hasRegionWithRegionName(
                        req.app.get('db'),
                        region,
                        countryId.id
                    )
                    .then(hasRegionWithRegionName => {
                        if (!hasRegionWithRegionName) {
                            UsersService.insertRegion(
                                req.app.get('db'),
                                countryId.id,
                                region
                            )
                            .then(regionId => 
                                CleanupsService.insertCleanup(
                                    req.app.get('db'),
                                    {
                                        location: regionId.id,
                                        user_name: req.params.id,
                                        type_of_trash: type_of_trash,
                                        quantity: quantity
                                    }
                                )
                            )
                            .then(
                                res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${req.params.id}`))
                            )   
                        } else {
                            UsersService.getRegionId(
                                req.app.get('db'),
                                region
                            )
                            .then(regionId =>
                                CleanupsService.insertCleanup(
                                    req.app.get('db'),
                                    {
                                        location: regionId.id,
                                        user_name: req.params.id,
                                        type_of_trash: type_of_trash,
                                        quantity: quantity
                                    }
                                )
                            )
                            .then(
                                res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${req.params.id}`))
                            )
                            .catch(next)
                        }
                    })
                )
            }
            
        })
        .catch(next)
        })


        
module.exports = cleanupsRouter;
