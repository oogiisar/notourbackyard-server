module.exports = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/notourbackyard', 
    NODE_ENV: process.env.NODE_ENV || 'development',
  }
