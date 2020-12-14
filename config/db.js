if(process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://dbuser:verteiros2@bloapp-prod.htvwu.mongodb.net/<dbname>?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}