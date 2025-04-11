const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const host = "http://localhost:3100/";

// 設定 Multer 儲存位置和檔案命名方式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // 檔案上傳的資料夾
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use(cors());

app.use("/ckeditor", express.static(path.join(__dirname, "public/ckeditor")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  try {
    res.status(200).json({
      message: "hello world",
    });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
});

// 建立上傳 API
app.post("/upload", upload.single("upload"), (req, res) => {
  try {
    // 取得完整檔案路徑
    const filePath = path.resolve(req.file.destination, req.file.filename);

    console.log(
      "file path",
      filePath, // 返回完整檔案路徑
      req.file // 包括其他檔案資訊
    );

    // 1. 參考 demo example https://ckeditor.com/docs/ckfinder/demo/ckfinder3/samples/ckeditor.html
    // 成功
    res.status(200).json({
      // message: "檔案上傳成功",
      // filePath: filePath, // 返回完整檔案路徑
      // fileDetails: req.file, // 包括其他檔案資訊

      fileName: req.file.filename,
      uploaded: req.query.CKEditorFuncNum, // 1,
      url: host + req.file.path,
    });

    // 2. 參考 網路範例 https://gist.github.com/RedactedProfile/ac48c270d2bbe739f9f3
    // 目前失敗
    // var html = "";
    // html += "<script type='text/javascript'>";
    // html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
    // html +=
    //   '    var url     = "http://localhost:3100/' + `${req.file.path}"` + ";";
    // html += '    var message = "Uploaded file successfully";';
    // html += "";
    // html +=
    //   "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";

    // html += "</script>";

    // 3. 參考 tda api https://www.tda.org.tw/ckeditor/UpLoader.asp?CKEditor=ND_content&CKEditorFuncNum=1&langCode=zh
    // 目前失敗
    // var html = "";
    // html += "<script>";
    // html += "function load(){";

    // html +=
    //   "document.onload=window.parent.CKEDITOR.tools.callFunction(1," +
    //   `'http://localhost:3100/${req.file.path}'` +
    //   ",'');";

    // html += "}";
    // html += "</script>";
    // html += `<body onload="load()"/>`;

    // res.send(html);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: "檔案上傳失敗", error: err });
  }
});

// 啟動伺服器
const PORT = 3100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
