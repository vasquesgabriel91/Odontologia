import 'dotenv/config';

const appConfig = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    jwt:{
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'

    }
}

export default appConfig;