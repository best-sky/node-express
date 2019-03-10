//加载mongodbmo
var MongoClient = require("mongodb").MongoClient;
//     mongodb服务 :// 主机地址 :端口号
var url = "mongodb://127.0.0.1:27017"

var DBNAME = "myWorks"; // 操作的数据库
//  client  ： 链接客户端   用来关闭连接
// 	collection ：链接(操作)的集合,表
//   data        ：操作的数据
// callback      ：操作后的回调
// rest     分页条数
var insertOne = function(client, collection, data, callback) { //插入单条数据
	collection.insertOne(data, function(err, result) {
		if(err) {
			console.log(err);
			console.log('单挑数据插入失败');
		} else {
			callback(result);
		}
		client.close(); // 关闭客户端
	})
}
var insertMany = function(client, collection, data, callback) { //插入多条数据
	collection.insertMany(data, function(err, result) {
		if(err) {
			console.log(err);
			console.log('多条数据插入失败');
		} else {
			callback(result);
		}
		client.close(); // 关闭客户端
	})
}
var find = function(client, collection, data, callback) {
	// 查询  注意  转换为数组
	collection.find(data).toArray(function(err, result) {
		if(err) {
			console.log("查询失败");
			console.log(err);
		} else {
			callback(result);
		}
		client.close();
	})
}
//排序
var sort = function(client, collection, data, callback, rest) {
	// 查询  注意  转换为数组
	collection.find(data).sort(rest).toArray(function(err, result) {
		if(err) {
			console.log("查询失败");
			console.log(err);
		} else {
			callback(result);
		}
		client.close();
	})
}
//设置查询数据的条数数
var limit = function(client, collection, data, callback, rest) {
	// 查询  注意  转换为数组
	collection.find(data).skip(rest).limit(rest).toArray(function(err, result) {
		if(err) {
			console.log("查询失败");
			console.log(err);
		} else {
			callback(result);
		}
		client.close();
	})
}

// 修改数据
// 操作的数据   data= 》 数组   [{条件},{内容}]
var updateOne = function(client, collection, data, callback) {
	// 第一  修改条件  // 第二  修改内容 	// 第三  回调
	// data 存  修改条件 和 内容
	// 对象  {a：{条件},b：{内容}}  数组  [{条件},{内容}]
	collection.updateOne(data[0], data[1], function(err, result) {
		if(err) {
			console.log("修改失败");
			console.log(err);
		} else {
			callback(result);
		}
		client.close();
	})
}
var updateMany = function(client, collection, data, callback) {
	// 第一  修改条件  // 第二  修改内容 	// 第三  回调
	// data 存  修改条件 和 内容
	// 对象  {a：{条件},b：{内容}}  数组  [{条件},{内容}]
	collection.updateMany(data[0], data[1], function(err, result) {
		if(err) {
			console.log("修改失败");
			console.log(err);
		} else {
			callback(result);
		}
		client.close();
	})
}
// 删除数据
var deleteOne = function(client, collection, data, callback) {
	collection.deleteOne(data, function(err, result) {
		if(err) {
			consle.log("删除失败");
			console.log(err);
		} else {
			callback(result);
		}
		client.close();
	})
}
var deleteMany = function(client, collection, data, callback) {
	collection.deleteMany(data, function(err, result) {
		if(err) {
			consle.log("删除失败");
			console.log(err);
		} else {
			callback(result);
		}
		client.close();
	})
}
var methods = {
	insertOne: insertOne,
	insertMany: insertMany,
	find: find,
	updateOne: updateOne,
	updateMany: updateMany,
	deleteOne: deleteOne,
	deleteMany: deleteMany,
	limit: limit,
	sort: sort
}
module.exports = function(type, collections, data, callback, rest) {
	MongoClient.connect(url, function(err, client) {
		if(err) {
			console.log('链接失败');
			console.log(err);
		} else { // 链接成功
			console.log('链接成功');
			var db = client.db(DBNAME); // 对数据库的链接
			var collection = db.collection(collections); // 对集合的链接
			// 增删改查函数 里面的参数
			//  client  ： 链接好的客户端    作用 关闭客户端
			// 	collection ：对集合的链接  作用 操作数据
			//   data        ：操作的数据
			// callback      ：操作后的回调
			methods[type](client, collection, data, callback, rest);
		}
	})
}