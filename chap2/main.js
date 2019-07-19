function hasUserMedia(){
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
if(hasUserMedia()){
	navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia({
		video:{
			mandatory:{
				minAspectRatio:1.777,
				maxAspectRatio:1.778
			},
			optional:{
				{maxWidth:640},
				{maxHeight:480}
			}
		},
		audio:true
	},function(stream){
		var video=document.querySelector('video');
		video.src=window.URL.createObjectURL(stream);
	},function(err){
		alert("asbh");	
	});
}else{
	alert("浏览器不支持 getUserMedia");
}