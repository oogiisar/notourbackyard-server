const knex = require('knex')
const app = require('../src/app');
const AuthService = require('../src/auth/auth-service');


describe('App', () => {
  it('GET / responds with 404 there should be no default path', () => {
    return supertest(app)
      .get('/')
      .expect(404)
  })
})

describe('Overview Endpoints', function() {

  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  it('Gets World sum of cleanups from DB', () => {
    return supertest(app)
      .get('/api/Overview/World')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
        const world = res.body[0]
        expect(world).to.include.all.keys('sum')
      })
  })
  it('Gets top 5 countries from DB', () => {
    return supertest(app)
      .get('/api/overview/top')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(5)
        const top = res.body[0]
        expect(top).to.include.all.keys('country_name', 'sum')
      })   
  })
  it('Gets specific country region cleanup count', () => {
    return supertest(app)
      .get('/api/overview/Mongolia/hovsgol')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
        const country_region = res.body[0]
        expect(country_region).to.include.all.keys('sum')
      })   
  })
})

describe('Cleanup Endpoint', function() {

  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
    })
    app.set('db', db)
  })

  let token

  before('get AuthToken', () => {
    const sub = 'oogiisar@gmail.com'
    const payload = {user_is: 1}
    token = AuthService.createJwt(sub, payload)
  })

  after('disconnect from db', () => db.destroy())

  it('Gets users cleanups', () => {
    return supertest(app)
      .get('/api/cleanups/1')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        const cleanups = res.body[0]
        expect(cleanups).to.include.all.keys('region_name', 'date', 'type_of_trash', 'quantity')
      })   
  })
})

describe('Users Endpoint', function() {

  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
    })
    app.set('db', db)
  })

  let token

  before('get AuthToken', () => {
    const sub = 'oogiisar@gmail.com'
    const payload = {user_is: 1}
    token = AuthService.createJwt(sub, payload)
  })

  after('Remove added user from db,', () =>
    db('users')
      .where('email', 'testing@test.com')
      .del()
  )
  after('disconnect from db', () => db.destroy())
  
  it('Gets types from DB', () => {
    return supertest(app)
      .get('/api/users/type')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(5)
        const types = res.body[0]
        expect(types).to.include.all.keys('enumlabel')
      })   
  })

  it('Adds user to db', () => {
    const password = '!QAZ2wsx' 
    const display_name = 'testing' 
    const email = 'testing@test.com' 
    const home_country = 'Mongolia'
    return supertest(app)
      .post('/api/users')
      .send({
        display_name: display_name, 
        email: email, 
        password: password, 
        home_country: home_country
      })
      .expect(201)
  })
})

describe('Auth Endpoint', function() {

  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  it('Login and gets Token', () => {
    return supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'demo@user.com',
        password: '!QAZ2wsx'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('object')
        const token = res.body
        expect(token).to.include.all.keys('authToken')
      })   
  })
})