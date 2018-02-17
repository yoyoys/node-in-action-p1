const socket = io.connect();

const chatApp = new Chat(socket);

socket.on('nameResult', result => {
  let message;
  if (result.sucess) message = `You are now known as ${result.name}.`;
  else message = result.message;
});

socket.on('joinResult', result => {
  $('#room').text(result.room);
  $('#messages').append(divSystemContentElement('Room Changed.'));
});

socket.on('message', message => {
  let newElement = $('<div></div>').text(message.text);
  $('#messages').append(newElement);
});

socket.on('rooms', rooms => {
  $('#room-list').empty();
  rooms.forEach(room => {
    if (room !== '') 
      $('#room-list').append(divEscapedContentElement(room));
  });
  $('#room-list div').click(function() {
    chatApp.processCommand(`/join ${$(this).text()}`);
    $('#send-message').focus();
  });

});


setInterval(function(){
  socket.emit('rooms');
}, 1000);

$('#send-message').focus();

$('#send-form').submit(()=>{
  processUserInput(chatApp, socket);
  return false;
});



function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div></div>').html(`<i>${message}</i>`);
}

function processUserInput(chatApp, socket) {
  let message = $('#send-message').val();
  let systemMessage;

  if (message.charAt(0) === '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#message').prop('scrollHeight'));
  }
  $('#send-message').val('');
}
