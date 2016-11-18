var username = prompt("The sliders are: red, green, blue, and line width. Click two points when using the line, rectangle, and ellipse tools. Please enter a username for the chat:");
var textBox = document.getElementById("inputTextBox");
var messageList = document.getElementById("messages");

function appendMessage(message, backgroundColor) {
	var listItem = document.createElement("li");
	var listItemText = document.createTextNode(message);
	listItem.appendChild(listItemText);
	if (arguments.length == 2)
		listItem.style.background = backgroundColor;
		
	messages.appendChild(listItem);
}

function sendMessage() {
	var message = username + ": " + document.getElementById("inputTextBox").value;
	textBox.value = ""; // clear textbox
	socket.emit("chat_message", message);
	console.log("message");
	return false;
} 
function updateScroll(){
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}
      socket.on("chat_message", function(message) {
        appendMessage(message); updateScroll();
      });
