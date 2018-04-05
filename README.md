# node.js创建server服务
一.初始环境搭建 
1. `mkdir server`创建server文件夹
2. `cd server`进入到创建的文件夹目录下
3. `npm init -y`生成含有默认配置的package.json文件
4. `npm install @types/node --save`配置node的类型定义文件
5. `npm install express --save`安装express
6 .`npm install @types/express --save`安装express的类型定义文件 

二.入门小例
1. 初始化server服务，建立hello_server.ts文件
2. 命令行输入 `tsc server/hello_server.ts`，生成对应的hello_server.js文件
3. 命令行启动8000端口，node server/hello_server.js,打开`localhost:8000`,可以看到`hell node!`
