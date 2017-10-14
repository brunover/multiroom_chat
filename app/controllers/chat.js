module.exports.inicia_chat = function (application, req, res) {
    var dadosForm = req.body;

    req.assert('apelido', 'Você deve informar um apelido').notEmpty();
    req.assert('apelido', 'O apelido deve ter entre 3 e 15 caracteres').len(3, 15);

    var validationErrors = req.validationErrors();

    if (validationErrors) {
        res.render('index', {
            formErrors: validationErrors
        });

    } else {
        // O 'emit' é um pedido do socket.io para executar alguma ação
        application.get('io').emit(
            'msgParaCliente', {
                apelido: dadosForm.apelido,
                msg: ' acabou de entrar no chat'
            }
        );

        res.render('chat', {
            apelido: dadosForm.apelido
        });
    }
};