var express = require("express");
// var router = express.Router();
var app = express();

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/uploader", multipartMiddleware, function (req, res) {
  var fs = require("fs");

  fs.readFile(req.files.upload.path, function (err, data) {
    var newPath = __dirname + "/../public/uploads/" + req.files.upload.name;
    fs.writeFile(newPath, data, function (err) {
      if (err) console.log({ err: err });
      else {
        html = "";
        html += "<script type='text/javascript'>";
        html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
        html += '    var url     = "/uploads/' + req.files.upload.name + '";';
        html += '    var message = "Uploaded file successfully";';
        html += "";
        html +=
          "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
        html += "</script>";

        res.send(html);
      }
    });
  });
});

// module.exports = router;

app.listen(3000, () => {
  console.log("server is listening to 3000");
});
