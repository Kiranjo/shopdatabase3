let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

var port=process.env.PORT ||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));


const {Client}=require("pg");
 const client=new Client({
    user: "postgres",
    password: "KiranJoshi@123",
    database: "postgres",
    port: 5432,
    host:"db.fzxawqyafzpldctxrqkb.supabase.co",
    ssl:{rejectUnauthorized:false},
});
client.connect(function(res,error){
    console.log(`Connected!!!`);
});

app.get("/shops",function(req,res,next){
    console.log("Inside/shops get api");
     let  query=`SELECT * FROM shops`;
    client.query(query,function(err,result){
        res.send(result.rows);
       
       //client.end();
    });
});

app.post("/shops",function(req,res,next){
    console.log("Inside post of shop");
    var values=Object.values(req.body);
    console.log(values);
    const query=`
 INSERT INTO shops (shopid,name,rent) VALUES ($1,$2,$3)`;
    client.query(query,values,function(err,result){
        if(err){
            res.status(400).send(err);
        }
        console.log(result);
        res.send(`${result.rowCount} insertion successful`);
    });
});

app.get("/products",function(req,res,next){
    console.log("Inside/products get api");
     let  query=`SELECT * FROM products`;
    client.query(query,function(err,result){
        res.send(result.rows);
       
       //client.end();
    });
});
app.get("/products/:id",function(req,res,next){
    console.log("Inside/products/id get api");
    let id=+req.params.id;
    let values=[id]
    const query=`SELECT * FROM products WHERE  productid=$1`;
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        res.send(result.rows);
       // client.end();
    });
});
app.post("/products",function(req,res,next){
    console.log("Inside post of products");
    var values=Object.values(req.body);
    console.log(values);
    const query=`
 INSERT INTO products (productid,productname,category,description) VALUES ($1,$2,$3,$4)`;
    client.query(query,values,function(err,result){
        if(err){
            res.status(400).send(err);
        }
        console.log(result);
        res.send(`${result.rowCount} insertion successful`);
    });
});
 
app.put("/products/:id",function(req,res,next){
    console.log("Inside put of products");
    let productid=+req.params.id;
    let productname=req.body.productname;
    let category=req.body.category;
    let description=req.body.description;
    let values=[productid,productname,category,description]
    const query=
    `UPDATE products SET productname=$2,category=$3,description=$4 WHERE productid=$1`;
    client.query(query,values,function(err,result){
        if(err){ res.status(400).send(err);}
        res.send(`${result.rowCount} updation successful`);
    });
});

app.get("/purchases",function(req,res,next){
    console.log("Inside/purchases get api");
    let shop=req.query.shop;
    let product=req.query.product;
    let sort=req.query.sort;
     let  query=`SELECT * FROM purchases`;
    client.query(query,function(err,result){
        if(shop){
         let shop1=shop.split("st");
      result.rows=result.rows.filter((st)=> shop1.find((b1)=>b1==st.shopid));
        }
        if(product){
          
            let proArr1=product.split(",");
         
         
     result.rows=result.rows.filter((rs)=>proArr1.find((b1)=>
     {
      
        let arr=b1.split("pr");
     return  arr.find((b1)=>b1==rs.productid);
    }));
       
        }
        if(sort==="QtyAsc"){
           result.rows.sort((st1,st2)=>+st1.quantity-(+st2.quantity));
        }
        if(sort==="QtyDesc"){
           result.rows.sort((st1,st2)=>+st2.quantity-(+st1.quantity));
        }
        if(sort==="ValueAsc"){
           result.rows.sort((st1,st2)=>+st1.quantity*+st1.price-(+st2.quantity*+st2.price));
        }
        if(sort==="ValueDesc"){
           result.rows.sort((st1,st2)=>+st2.quantity*+st2.price-(+st1.quantity*+st1.price));
        }
        res.send(result.rows);
       
       //client.end();
    });
});
app.get("/purchases/shops/:id",function(req,res,next){
    console.log("Inside/purchases/id get api");
    let id=+req.params.id;
    let values=[id]
    const query=`SELECT * FROM purchases WHERE  shopid=$1`;
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        res.send(result.rows);
       // client.end();
    });
});
app.get("/purchases/products/:id",function(req,res,next){
    console.log("Inside/purchases/id get api");
    let id=+req.params.id;
    let values=[id]
    const query=`SELECT * FROM purchases WHERE  productid=$1`;
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        res.send(result.rows);
       // client.end();
    });
});
app.get("/totalPurchase/shop/:id",function(req,res,next){
    console.log("Inside/purchases/id get api");
    let id=+req.params.id;
    let values=[id]
    const query=`SELECT * FROM purchases WHERE  productid=$1`;

if (shop) res.send("total val="+shop);
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        
     result.rows=result.rows.filter((st)=>st.shopid===id);
    console.log(find);
    result.rows=result.rows.reduce((acc,curr)=>{
     return acc+(curr.price*curr.quantity);
    },0)
 
        res.send(result.rows);
       // client.end();
    });
});
app.get("/totalPurchase/product/:id",function(req,res,next){
    console.log("Inside/purchases/id get api");
    let id=+req.params.id;
    let values=[id]
    const query=`SELECT * FROM purchases WHERE  productid=$1`;

if (shop) res.send("total val="+shop);
    client.query(query,values,function(err,result){
        if (err) {res.status(400).send(err);}
        
     result.rows=result.rows.filter((st)=>st.productid===id);
    console.log(find);
    result.rows=result.rows.reduce((acc,curr)=>{
     return acc+(curr.price*curr.quantity);
    },0)
 
        res.send(result.rows);
       // client.end();
    });
});




app.post("/purchases",function(req,res,next){
    console.log("Inside post of purchases");
    var values=Object.values(req.body);
    console.log(values);
    const query=`
 INSERT INTO purchases (purchaseid,shopid,productid,quantity,price) VALUES ($1,$2,$3,$4,$5)`;
    client.query(query,values,function(err,result){
        if(err){
            res.status(400).send(err);
        }
        console.log(result);
        res.send(`${result.rowCount} insertion successful`);
    });
});






