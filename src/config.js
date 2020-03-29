module.exports = {
    PORT: process.env.PORT || 8000,
    DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/notourbackyard', 
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || "super-secret",
    JWT_EXPIRY: process.env.JWT_EXPIRY || '240m',
  }