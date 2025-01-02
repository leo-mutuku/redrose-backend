module.exports = {
  apps: [
    {
      name: 'Red_rose',                     // Name of the application
      script: './index.js',                 // Path to your main application file
      cwd: './',                            // Set current working directory (optional)
      env: {
        NODE_ENV: 'development',           // Environment variable for development
        DB_HOST: '127.0.0.1',
        DB_PORT: '5432',
        DB_USER: 'postgres',
        DB_PASSWORD: 'admin',              // In development, use a default password or leave blank
        DB_NAME: 'red_rose',
        PORT: '9000',
        JWT_SECRET: 'VerySecretKey',
      },
      env_production: {
        NODE_ENV: 'production',            // Environment variable for production
        DB_HOST: '127.0.0.1',
        DB_PORT: '5432',
        DB_USER: 'postgres',
        DB_PASSWORD: 'admin',
        DB_NAME: 'red_rose',
        PORT: '9000',
        JWT_SECRET: 'VerySecretKey',
        API_KEY: 'your-api-key',           // Replace with actual API key
        SMS_URL: 'https://isms.celcomafrica.com/api/services/sendsms/',
        SMS_BULK_URL: 'https://isms.celcomafrica.com/api/services/sendbulk/',
        SMS_API_KEY: 'b21b2b70d19cee26f654ac0c7b69bd3b',
        SMS_PARTNERID: '215',
        SMS_SHORTCODE: 'NOVENA LTD',
        CAPTAIN_PRINTER: '192.168.88.5',    // Captain's printer IP
        CUSTOMER_PRINTER: '192.168.88.7',   // Customer's printer IP
      },
    },
  ],
};
