const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, display_name, email, home_country } = req.body
    for (const field of ['display_name', 'password', 'email',  'home_country'])
        if (!req.body[field])
            return res.status(400).json({
               error: `Missing '${field}' in request body`
    })

    const passwordError = UsersService.validatePassword(password)
    if (passwordError)
        return res.status(400).json({ error: passwordError })
    // Make sure the country exists in the database if it does not we need to add it    
    UsersService.hasCountryWithCountryName(
        req.app.get('db'),
        home_country
    )

    .then(hasCountryWithCountryName => {
        if (!hasCountryWithCountryName)  {
            return UsersService.insertCountry(
                req.app.get('db'),
                home_country
            )
        // after adding the country above we add the user
        .then(UsersService.hasUserWithUserName(
            req.app.get('db'),
            email
        )

        .then(hasUserWithUserName => {
            let country_id
            if (hasUserWithUserName)
                return res.status(400).json({ error: `Username already taken` })
        
                UsersService.getCountryId(
                    req.app.get('db'),
                    home_country
                )
                .then( countryId  =>
                    country_id = countryId.id
                )

                return UsersService.hashPassword(password)
                    .then(hashPassword => {
                        const newUser = {
                            display_name,
                            email,
                            home_country: country_id,
                            password: hashPassword,
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                        })
            })
            .catch(next)
        )
    } else {
        // The country already existed so we just add the user
        UsersService.hasUserWithUserName(
            req.app.get('db'),
            email
        )

        .then(hasUserWithUserName => {
            let country_id
            if (hasUserWithUserName)
                return res.status(400).json({ error: `Username already taken` })
        
                UsersService.getCountryId(
                    req.app.get('db'),
                    home_country
                )
                .then( countryId  =>
                    country_id = countryId.id
                )

                return UsersService.hashPassword(password)
                    .then(hashPassword => {
                        const newUser = {
                            display_name,
                            email,
                            home_country: country_id,
                            password: hashPassword,
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                        })
            })
            .catch(next)
    }})
});

usersRouter
    .route('/type')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
            UsersService.getTypes(knexInstance)
            .then(types  => {
                res.status(200).json(types)
            })
    });

module.exports = usersRouter;