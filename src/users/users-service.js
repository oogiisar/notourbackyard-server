const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getTypes(db) {
        return db('pg_enum')
        .select('enumlabel')
    },
    hasUserWithUserName(db, email) {
        return db('users')
            .where({ email })
            .first()
            .then(email => !!email)
    },
    hasCountryWithCountryName(db, country_name) {
        return db('countries')
            .where({ country_name })
            .first()
            .then(country_name => !!country_name)
    },
    hasRegionWithRegionName(db, region_name, country) {
        return db('region')
            .where({ 
                region_name: region_name,
                country: country
            })
            .first()
            .then(region_name => !!region_name)
    },
    insertCountry(db, country_name) {
        return  db
            .insert({country_name: country_name})
            .into('countries')
            .returning('*')
            .then(([country_name]) => country_name)
    },
    getCountryId(db, country_name) {
        return db('countries')
            .where('country_name', '=', country_name)
            .then(([country_name]) =>  country_name)
    },
    getRegionId(db, region_name) {
        return db('region')
            .where('region_name', '=', region_name)
            .then(([region_name]) =>  region_name)
    },
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
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user])  => user)
    },
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
    serializeUser(user) {
        return {
            display_name: xss(user.display_name),
            email: xss(user.email),
            home_country: xss(user.home_country),
        }
    },
}
  
module.exports = UsersService