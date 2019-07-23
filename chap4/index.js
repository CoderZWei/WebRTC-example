var WebSocketServer=require("ws").Server,
	wss=new WebSocketServer({port:8888});
users={};
wss.on("connection",function(connection){
	console.log("user connected");
	connection.on("message",function(message){
		var data;
		try{
			data=JSON.parse(message);
		}catch(e){
			console.log("error parsing JSON");	
			data={};
		}
		console.log("got message:",message);
		switch(data.type){
			//用户登录
			case "login":
				if(users[data.name]){
					sendTo(connection,{
						type:"login",
						success:false
					});
				}else{
					users[data.name]=connection;
					connection.name=data.name;
					sendTo(connection,{
						type:"login",
						success:true
					});
				}
				break;
			//发送消息
			case "offer":
				console.log("sending offer to",data.name);
				var conn==users[data.name];
				if(conn!=null){
					connection.otherName=data.name;
					sendTo(conn,{
						type:"offer",
						offer:data.offer,
						name:connection.name
					});
				}
				break
			//呼叫应答
			case "answer":
				console.log("sending answer to",data.name);
				var conn=users[data.name];
				if (conn!=null) {
					connection.otherName=data.name;
				}
				sendTo(conn,{
						type:"answer",
						offer:data.answer,
					});
				break;
			//ICE候选路径
			case "candidate":
				console.log("sending candidate to",data.name);
				var conn=users[data.name];
				if(conn!=null){
					sendTo(conn,{
						type:"candidate",
						candidate:data.candidate
					});
				}
				break;
			case "leave":
				console.log("disconnecting user from",data.name);
				var conn=users[data.name];
				conn.otherName=null;
				if(conn!=null){
					sendTo(conn,{
						type:"leave";
					});
				}
				break;
			default:
				sendTo(connection,{
					type:"error",
					message:"Unrecogniized command:"+data.type
				});
				break;
		}
	});
	connection.on("close",function(){
		if(connection.name){
			delete users[connection.name];
		}
	});

	connection.send("hello");
});

function sendTo(conn,message){
	conn.send(JSON.stringify(message));
}