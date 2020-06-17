const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('prices.csv');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');

app.get("/",function(req,res){
    res.render('pages/index');
})




app.post('/product', function(req, res) {
  var productName = req.body.product;
  var product = productName.split(/\r?\n/);

  
writeStream.write(`Product,Price \n`);


product.forEach(function(prod){
    
    request('https://www.amazon.in/s?k='+prod+'&ref=nb_sb_noss_2',(error,response,html)=>{
        // console.log('https://www.amazon.in/s?k='+prod+'&ref=nb_sb_noss_2');
        var productArray = [];
        var productPrice = 0;
        
        if(!error && response.statusCode == 200){
            const $ = cheerio.load(html);
            $('.a-price-whole').each(function(i,el){
                const item = $(el).text();
                
                productArray.push(parseInt(item.replace(/,/g, ''), 10));
            });
            
            for(var i = 0; i<=10; i++){
                productPrice = productArray[i] +  productPrice;
            }
            writeStream.write(`${prod},${productPrice/10} \n`);
            console.log(prod+": Rs."+(productPrice/10));
            

        }

    });
});


res.send("CSV file outputed.Please check terminal for output");

console.log('CSV file is ready ');
});


app.listen(5000, function() {
    console.log('App is running on 5000');
})

