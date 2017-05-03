module.exports = {
    port: 8081,
    host: '127.0.0.1',
    SALT_FACTOR: 5,
    app: {
        name: 'Macaroon Store'
    },
    database: {
        client: 'mysql',
        connection: {
            port: 3306,
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'macaroon'
        },
        pool: {
            min: 2,
            max: 20
        },
        acquireConnectionTimeout: 10000,
        migrations: {
            tableName: 'migrations'
        }
    }
};