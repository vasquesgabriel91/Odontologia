import 'dotenv/config';

const config = {
  
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME,
    host:process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
}


export default config;