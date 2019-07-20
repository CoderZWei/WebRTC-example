function hasUserMedia(){
	navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	return !!navigator.getUserMedia;
}
function hasRTCPeerConnection(){
	window.RTCPeerConnection=window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	return !!window.RTCPeerConnection;
}

var yourVideo=document.querySelector("#yours"),
	theirVideo=document.querySelector("#theirs"),
	yourConnection,theirConnection;
if(hasUserMedia()){
	//navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia({
		video:true,
		audio:false
	},function(stream){
		yourVideo.src=window.URL.createObjectURL(stream);

		if(hasRTCPeerConnection()){
			startPeerConnection(stream);
		}else{
			alert("浏览器不支持WebRTC");
		}
		// yourConnection.addStream(stream);
		// theirConnection.onaddstream=function(e){
		// 	theirVideo.src=window.URL.createObjectURL(e.stream);
		// };
	},function(error){
		alert("发生错误");
	});
}else{
	alert("浏览器不支持WebRTC");
}

function startPeerConnection(stream){
	var configuration={
		// "iceServers":[{"url":"stun:127.0.0.1:9876"}]
	};
	alert("here3");
	yourConnection= new webkitRTCPeerConnection();
	alert("here2");
	theirConnection= new webkitRTCPeerConnection();
	alert("here1");
	//创建ICE处理
	yourConnection.onicecandidate=function(event){
		if(event.candidate){
			alert("right");
			theirConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
		}else{
			alert("error");
		}
	};

	theirConnection.onicecandidate=function(event){
		if(event.candidate){
			yourConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
		}
	};
	//开始offer
	yourConnection.createOffer(function(offer){
		yourConnection.setLocalDescription(offer);
		theirConnection.setRemoteDescription(offer);

		theirConnection.createAnswer(function(offer){
			theirConnection.setLocalDescription(offer);
			yourConnection.setRemoteDescription(offer);
		});
	});
	yourConnection.addStream(stream);
	theirConnection.onaddstream=function(e){
			theirVideo.src=window.URL.createObjectURL(e.stream);
		};
};