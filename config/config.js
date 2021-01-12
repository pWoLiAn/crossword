module.exports = {

    mongodb: {
        dbURI: "mongodb://localhost:27017/crosswordyan21",
        setting: {
            useNewUrlParser:true,
            useUnifiedTopology:true   // to fix deprecation issues
        }
    },
    session: {
        secretString: "SessionHashPassword"
    },
    encryption: {
        key: "1369f7bf4088308ab82edcdb9974da2b288ef2f5f65a80fb1b70fa7d87723329",
        iv: "6c36deeeb09980c74ac06070aef576d0"
    },
    baseUrl: "http://localhost:8081/",
    sendgrid: {
        FromAddress:"noreply@pragyan.com",
        apiKey:"[insert your sendgrid api key]"
    }
};


