/* Importar configurações do servidor */
var app = require('./config/server');

/* Parametizar a porta de escuta */
var server = app.listen('80', function () {
    console.log('Servidor ONLINE (porta: 80)');
});

// Tanto app quanto socket.io irão escutar as requisições na porta 80
// OBS: para funcionar é preciso importar o socket,io na página em que
// ele será usaddo, para isso é só usar a tag script na página ejs:
// <script src="/socket.io/socket.io.js"></script>
var io = require('socket.io').listen(server);

// Define 'io' como uma variável global, dessa forma ela pode ser acessada
// de qualquer lugar que esteja usando 'application', é só usar o comando
// abaixo na página que quiser utilizar o socket.io
// Exemplo: application.get('io')
app.set('io', io);

// Criar a conexão por websocket. O evento 'connection' é padrão do
// socket.io, ele pesquisa no servidor quando uma tentativa de 
// conexão é feita do lado do cliente
io.on('connection', function (socket) {
    console.log('Socket.io: Usuário conectou');

    // ---------------------------
    // Entrada e saída 
    socket.on('disconnect', function (socket) {
        console.log('Socket.io: Usuário desconectou');
    });

    socket.on('msgParaServidor', function (data) {
        // ---------------------------
        // Diálogo
        // Devolve para o usuário a própria mensagem enviada por ele
        socket.emit('msgParaCliente', {
            apelido: data.apelido,
            msg: data.msg
        });

        // Transmite a mensagem do usuário para os outros que estiverem no chat
        socket.broadcast.emit('msgParaCliente', {
            apelido: data.apelido,
            msg: data.msg
        });

        // ---------------------------
        // Atualiza a relação de participantes
        // Devolve para o usuário o seu próprio apelido para por na lista de participantes
        if (parseInt(data.apelido_atualizado) == 0) {
            socket.emit('participantesParaCliente', {
                apelido: data.apelido
            });

            // Transmite o apelido do usuário para os outros que estiverem no chat
            socket.broadcast.emit('participantesParaCliente', {
                apelido: data.apelido
            });
        }
    });
});