const express = require("express");
const PORT = process.env.PORT || 5858;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors =require("cors")
const config = require("./key");

// const {nanoid} = require('nanoid')
const UrlModel = require("./model");

// app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// DB connect
mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
//Bind connection to connected event (to get notification of connection success)
db.on("connected", console.log.bind(console, "MongoDB connection successful"));
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));


app.use(cors())

// // middleware
// app.use((req, res, next) => {
//   console.log(req.method);
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   // if (req.method === "OPTION") {
//   //   res.header("Access-Control-Allow-Methods", "GET,PUT,POST, PATCH, DELETE");
//   //   next();
//   // }
//   next();

// });






// router
app.get("/", async (req, res) => {
  await UrlModel.find((err, data) => {
    if (err) {
      return res.json({
        response: {
          ok: false,
          message: "Please try again!",
        },
      });
    }
    if (data) {
      return res.json({
        response: {
          ok: true,
          message: "All url found",
        },
        data: data,
      });
    }
  });
});

app.post("/submit", async (req, res) => {
  console.log("Data: ",req.body);
  const newUrl = new UrlModel({
    orginalUrl: req.body.orginalUrl,
    shortUrl: req.body.shortUrl,
  }).save( async (err, data) => {
    if (err) {
      return res.json({
        response: {
          ok: false,
          message: "Please try again!",
        },
      });
    }
    if (data) {
    console.log("Data Saved: ",data);
    return res.json({
        response: {
          ok: true,
          message: "Short url is saved to database successfully!",
        },
        data: data,
      });
    }
  });
  // return res.json({
  //     response : {
  //         ok : true,
  //         message : "Operation successfull!",
  //     },
  // })
});

// app.get("/submit/:org/:short", async (req, res) => {
//   // console.log("Data: ",req.body);
//   const {org , short} = req.params
//   const newUrl = new UrlModel({
//     orginalUrl: org,
//     shortUrl: short,
//   }).save( async (err, data) => {
//     if (err) {
//       return res.json({
//         response: {
//           ok: false,
//           message: "Please try again!",
//         },
//       });
//     }
//     if (data) {
//     console.log("Data Saved: ",data);
//     return res.json({
//         response: {
//           ok: true,
//           message: "Short url is saved to database successfully!",
//         },
//         data: data,
//       });
//     }
//   });
//   // return res.json({
//   //     response : {
//   //         ok : true,
//   //         message : "Operation successfull!",
//   //     },
//   // })
// });

// short url use action
app.get("/:shortUrl", async (req, res) => {
  console.log(req.params.shortUrl);
  const findData = await UrlModel.findOne({ shortUrl: req.params.shortUrl });

  if (findData === null) {
    return res.json({
      response: {
        ok: false,
        message: "No data  found!",
      },
    });
  }
  else{
      findData.clicks++
      findData.save((err, data)=>{
          if(err){
            return res.json({
                response: {
                  ok: false,
                  message: "Clicks count not saved!",
                },
              }); 
          }if (data){
            // return res.json({
            //     response: {
            //       ok: true,
            //       message: "Click updated!",
            //     },
            //   });
            return res.redirect(data.orginalUrl)
          }
      })
  }
});

// invalid url handler
app.use("*", (req, res) => {
  console.log("Invalid URL entered");
  res.json({
    response: {
      ok: false,
      message: "",
    },
  });
});

app.listen(PORT, () => {
  console.log(`[${PORT}]Server running..`);
});
