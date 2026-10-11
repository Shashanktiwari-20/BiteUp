if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables")
}
if(!process.env.EMAIL_PASS){
    throw new Error("EMAIL_PASS is not defined in environment variables")
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables")
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables")
}
if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in environment variables")
}
if(!process.env.GOOGLE_USER){
    throw new Error("GOOGLE_USER is not defined in environment variables")
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in environment variables")
}
if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("IMAGEKIT_PUBLIC_KEY is not defined in environment variables")
}
if(!process.env.IMAGEKIT_URL_ENDPOINT){
    throw new Error("IMAGEKIT_URL_ENDPOINT is not defined in environment variables")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER:process.env.GOOGLE_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_URL_ENDPOINT:process.env.IMAGEKIT_URL_ENDPOINT
}

module.exports = config