module.exports = {
    port: 8081,
    host: '127.0.0.1',
    app: {
        name: 'Macaroon Store'
    },
    database: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'world'
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