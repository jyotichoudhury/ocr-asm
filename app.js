var express             = require("express");
var app                 = express();
//var http                = require("http").Server(app).listen(3000);
var upload              = require("express-fileupload");
var cp                  = require("child_process");
var fs                  = require("fs");
var cookieParser        = require("cookie-parser");
const savePixels = require('save-pixels')
const getPixels = require('get-pixels')
const adaptiveThreshold = require('adaptive-threshold')

app.listen(3000,()=>{
console.log("server started at 3000");
});

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(upload({createParentPath: true}));
//app.use(upload({ safeFileNames: true,createParentPath:true,limits: {fileSize: 20 * 1024 * 1024}}));
app.use(express.static(__dirname+'/public'));
app.get('/',(req, res)=>{
    //res.sendFile(__dirname+"/index.html");
    //var testfilename = __dirname+'/uploads/'+'1itlasmwu2fr6polm28n/6op2vpjcr6xw21ndknvg.txt'
    //res.cookie("fl", encodeURI(testfilename));
    res.render("index1",{resFileNameText: "",downloadlink:""});
    
})

//var resFileName;

app.post('/',(req,res)=>{

    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('Please select a file');
      }

    console.log("hello world");

    if(req.files){
        //console.log(req.file);
        
        var file = req.files.inputFile;
        var filename = "upldFile.jpg";
        //console.log(filename);
        
        //console.log(req.files);
        function makeid() {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
          
            for (var i = 0; i < 20; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
          }
        var filepath = __dirname + '/uploads/'+ makeid()+ '/';
        //var filepath = '/uploads/'+ makeid()+ '/';
        var resFileName = filepath + makeid();
        var thrsldFileName = filepath + makeid();

        //var exectess = "tesseract "+filepath+filename+ " "+resFileName+ " -l asm"

        //function thrsld (callback){

            //console.log("function call started");

            file.mv(filepath+filename,function(err){
                if(err){
                    console.log(err);
                    //res.send(err);
                }
                else{

                    console.log("this is where thresholding will be done");

                    getPixels(filepath+filename, (err, pixels) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        let thresholded = adaptiveThreshold(pixels)
                        savePixels(thresholded, 'png').pipe(fs.createWriteStream(thrsldFileName)).on('finish',ocr)
                      })
                }

                //callback()
                }
            )
        //}

        
        function ocr() {

/*             file.mv(filepath+filename,function(err){
                if(err){
                    console.log(err);
                    //res.send(err);
                }
                else{ */

                    console.log("starting tesseract");

                    var child = cp.spawn('tesseract',[thrsldFileName,resFileName,'-l','asm+eng']);       

                    child.on('exit',()=>{
                        fs.readFile(resFileName+'.txt',(err,data)=>{
                            if(err){
                            res.send(err);
                            }
                            else{
                            res.cookie("fl",resFileName+'.txt');
                            res.render('index1',{resFileNameText: data, downloadlink:resFileName+'.txt'});
                            
                            }
                        });
                    });
            
                    //res.send(exectess);
                //}
            
        }
        //thrsld(ocr);
    }
});

 app.get('/download',(req,res)=>{
     //console.log(decodeURI(req.cookies.fl));
    res.download(decodeURI(req.cookies.fl));
  })