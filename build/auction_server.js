"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
app.use('/', express.static(path.join(__dirname, '..', 'client')));
var Product = /** @class */ (function () {
    function Product(id, title, price, star, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.star = star;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var products = [
    new Product(1, "第1个商品", 1.99, 1.5, "这是第1个商品", ["电子产品", "硬件设备"]),
    new Product(2, "第2个商品", 2.99, 2.5, "这是第2个商品", ["电子产品", "硬件设备"]),
    new Product(3, "第3个商品", 3.99, 3.5, "这是第3个商品", ["电子产品"]),
    new Product(4, "第4个商品", 4.99, 4.5, "这是第4个商品", ["电子产品", "硬件设备"]),
    new Product(5, "第5个商品", 5.99, 3.5, "这是第5个商品", ["电子产品", "硬件设备"]),
    new Product(6, "第6个商品", 6.99, 4.5, "这是第6个商品", ["图书"]),
];
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var comments = [
    new Comment(1, 1, "2018-02-02 22:22:22", "张三", 3, "东西不错"),
    new Comment(2, 1, "2018-01-02 16:22:22", "张三", 4, "东西挺不错"),
    new Comment(3, 1, "2018-03-02 21:22:22", "张三", 2, "东西还不错"),
    new Comment(4, 2, "2018-04-02 23:22:22", "张三", 4, "东西非常不错")
];
app.get('/api', function (req, res) {
    res.send("hello express");
});
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category && params.category !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器已启动，地址是：http://localhost:8000");
});
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    websocket.send('这是服务器主动推送的消息');
    websocket.on('message', function (message) {
        var messageObj = JSON.parse(JSON.stringify(message));
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
