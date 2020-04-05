const xss = require('xss');
const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
    // Types of garbage from DB
    getTypes(db) {
        return db('pg_enum')
        .select('enumlabel')
    },
    // Checks if user exists
    hasUserWithUserName(db, email) {
        return db('users')
            .where({ email })
            .first()
            .then(email => !!email)
    },
    // Checks if country already in DB
    hasCountryWithCountryName(db, country_name) {
        return db('countries')
            .where({ country_name })
            .first()
            .then(country_name => !!country_name)
    },
    // Checks if region already in DB
    hasRegionWithRegionName(db, region_name, country) {
        return db('region')
            .where({ 
                region_name: region_name,
                country: country
            })
            .first()
            .then(region_name => !!region_name)
    },
    // Adds country to DB
    insertCountry(db, country_name) {
        return  db
            .insert({country_name: country_name})
            .into('countries')
            .returning('*')
            .then(([country_name]) => country_name)
    },
    // Gets the numeric ID of existing country
    getCountryId(db, country_name) {
        return db('countries')
            .where('country_name', '=', country_name)
            .then(([country_name]) =>  country_name)
    },
    // Gets the numeric ID of existing Region
    getRegionId(db, region_name) {
        return db('region')
            .where('region_name', '=', region_name)
            .then(([region_name]) =>  region_name)
    },
    // Add region to DB
    insertRegion(db, country, region_name) {
        return db  
            .insert({
                region_name: region_name,
                country: country
            })
            .into('region')
            .returning('*')
            .then(([region_name]) => region_name)
    },
    // Add user to db
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user])  => user)
    },
    // Validates user password requirments
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    // Sanitize user input
    serializeUser(user) {
        return {
            display_name: xss(user.display_name),
            email: xss(user.email),
            home_country: xss(user.home_country),
        }
    },
};
  
module.exports = UsersService;