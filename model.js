const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
    orginalUrl : String,
    shortUrl : String,
    clicks : {type: Number, default: 0}
})

const UrlData = mongoose.model('UrlData', urlSchema)
module.exports = UrlData;

