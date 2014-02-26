// JavaScript Document
$(document).ready(function() {
	var socket = io.connect(window.location.hostname);
	$("#user_input").submit(function(e) {
		socket.emit("send",$("#user").val(),$("#message").val());
		return false;
    });
	function currentTime()
	{
		var currentDate = new Date();
		return currentDate.toLocaleTimeString();
	}
	function currentDate()
	{
		var currentDate = new Date();
		return currentDate.toDateString();
	}
	socket.on('receive', function(user,message){
		$.get("/chat/message",{ from : user, content : message },function(data){
			$("#chat_window").append(data);
		});
	});
	$("#message").keyup(function(e) {
        this.style.height = (this.scrollHeight)+"px";
    });
	$("#message").removeAttr("disabled");
});