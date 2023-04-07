export const jwtConfig = {
    accessSecretkey: "opelastrag",
    refreshSecretkey: "annamari",
    verifySecretkey: "miúcska",
    accesshJwtExpire: 60,
    refreshJwtExpire: 60 * 60 * 24,
    verifyJwtExpire: 60 * 60 * 24 * 7
}

export const serverConfig = {
    hostname: "localhost",
    port: 6060
}

export const dbConfig = {
    connectionUrl: 'mongodb+srv://testUser:YoBFkIWy9aY64PXb@cluster0.hgbuxsu.mongodb.net/?retryWrites=true&w=majority',
    dbName: "chatApp"
}

export const multerConfig = {
    savePath: "public/images/",
    filterErrorMsg: "Hibás fájlformátum"
}

export const bcryptConfig = {
    saltRounds: 10
}