module.exports = {

    mongodb: {
        dbURI: "mongodb://localhost:27017/crosswordyan21",
        setting: {
            useNewUrlParser:true,
            useUnifiedTopology:true   // to fix deprecation issues
        }
    },
    session: {
        secretString: "may the force be with you"
    },
    imap: {
        host: "203.129.195.133",
        port: 143
    },
    encryption: {
        key: "[ENCRYPTION KEY]",
        iv: "[ENCRYPTION IV]"
    },
    baseUrl: "http://localhost:8081/",
    sendgrid: {
        FromAddress:"noreply@pragyan.com",
        apiKey:"[insert your sendgrid api key]"
    }
};