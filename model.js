const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
    orginalUrl : String,
    shortUrl : String,
    clicks : {type: Number, default: 0},
    time : {
        type : Date,
        default: Date.now()
    }
})

const UrlData = mongoose.model('UrlData', urlSchema)
module.exports = UrlData;

