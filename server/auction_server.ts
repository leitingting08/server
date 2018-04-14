import * as express from 'express';
import { Server } from 'ws'

const app = express();
export class Product{
    constructor(
        public id:number,
        public title:string,
        public price:number,
        public star:number,
        public desc:string,
        public categories:Array<string>
        ){

    }
}

const products:Product[] = [
      new Product(1,"第1个商品",1.99,1.5,"这是第1个商品",["电子产品","硬件设备"]),
      new Product(2,"第2个商品",2.99,2.5,"这是第2个商品",["电子产品","硬件设备"]),
      new Product(3,"第3个商品",3.99,3.5,"这是第3个商品",["电子产品"]),
      new Product(4,"第4个商品",4.99,4.5,"这是第4个商品",["电子产品","硬件设备"]),
      new Product(5,"第5个商品",5.99,3.5,"这是第5个商品",["电子产品","硬件设备"]),
      new Product(6,"第6个商品",6.99,4.5,"这是第6个商品",["图书"]),
      ];

export class Comment {
  constructor(public id:number,
        public productId:number,
        public timestamp:string,
        public user:string,
        public rating:number,
        public content:string
    ){

  }
}

const comments:Comment[] = [
         new Comment(1,1,"2018-02-02 22:22:22","张三",3,"东西不错"),
         new Comment(2,1,"2018-01-02 16:22:22","张三",4,"东西挺不错"),
         new Comment(3,1,"2018-03-02 21:22:22","张三",2,"东西还不错"),
         new Comment(4,2,"2018-04-02 23:22:22","张三",4,"东西非常不错")
   ]

app.get('/api', (req,res) =>{
    res.send("hello express");
});

app.get('/api/products', (req,res) =>{
    let result = products;
    let params = req.query;
    if(params.title){
      result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }

    if(params.price && result.length > 0){
      result = result.filter((p) => p.price <= parseInt(params.price));
    }

    if(params.category && params.category !== "-1" && result.length > 0){
      result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
    }
    res.json(result);
});

app.get('/api/product/:id', (req,res) =>{
    res.json(products.find( (product) => product.id == req.params.id ));
});

app.get('/api/product/:id/comments', (req,res) =>{
    res.json(comments.filter((comment: Comment)=> comment.productId == req.params.id));
});

const server = app.listen(8000, "localhost", () =>{
    console.log("服务器已启动，地址是：http://localhost:8000");
});

const wsServer = new Server({port: 8085});
wsServer.on("connection", websocket => {
  websocket.send('这是服务器主动推送的消息');
  websocket.on('message', message => {console.log("接收到消息:"+ message)});
});

setInterval(() => {
  if(wsServer.clients){
    wsServer.clients.forEach( client => {
      client.send('这是定时推送');
    })
  }
}, 2000);