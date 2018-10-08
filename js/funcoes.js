$(document).ready(function () {
    $("form").submit(function () {
        return false;
    });

    var $username;

    $("input[name=unome]").change(function(){
        $username = $(this).val();
    });


    //Formulario de Cadastro
    $("form[name=form_cadastro]").submit(function () {
        var $unome = $("form[name=form_cadastro] input[name=unome]").val(),
            $senha = $("form[name=form_cadastro] input[name=senha]").val();
        $.ajax({
            type: 'post',
            url: '//app.messengerblue.rf.gd/api/1.0/cadastro.php',
            data: { unome: $unome, senha: $senha },
            success: function (dados) {
                if (dados == "sucesso") {
                    swal({
                        text: "Cadastrado com sucesso!",
                        type: "success"
                    });
                    $(".tela_cadastro").hide();
                    $(".tela_login").show();
                } else if (dados == "ja cadastrado") {
                    swal({
                        text: "Ja tem um cadastro com esse username",
                        type: "error"
                    });
                };
            },
        });

        return false;
    });

    // Formulario de Login
    $("form[name=form_login]").submit(function () {
        var $unome = $("form[name=form_login] input[name=unome]").val(),
            $senha = $("form[name=form_login] input[name=senha]").val();
        $.ajax({
            type: 'post',
            url: '//app.messengerblue.rf.gd/api/1.0/login.php',
            data: { unome: $unome, senha: $senha },
            success: function (dados) {
                if (dados == "logado") {
                    if (typeof(Storage) !== "undefined") {
                        $(".tela_all").hide();
                        $(".tela_inicial").show();
                        swal({
                            type: 'success',
                            title: 'Login',
                            text: 'Você foi logado com sucesso como,' + $username + '. Por favor, escolha um canal para começar a conversar!'
                        });
                        localStorage.setItem("username", $username);
                    }else{
                        swal({
                           type: 'error',
                           title: 'Error!',
                           text: 'Sorry, your browser does not support Web Storage...'
                        });
                    }
                } else if (dados == "n_cadastrado") {
                    swal({
                        text: "Usuario não encontrado",
                        type: "error"
                    });
                } else if (dados == "n_senha") {
                    swal({
                        text: "Senha incorreta",
                        type: "error" 
                    });
                };
            },
        });

        return false;
    });

    //Verificar se logou
    function verifLogin(){
        if (localStorage.getItem("username") != null) {
            $(".tela_all").hide();
            $(".tela_inicial").show();
            $username = localStorage.getItem("username");
            clearInterval($time_ferifilogin);
        }
    }

    let $time_ferifilogin = setInterval(function(){
        verifLogin();
    }, 1000);

    //Login para cadastro
    $(".btn_atvt_cadastro").click(function () {
        $(".tela_login").hide();
        $(".tela_cadastro").show();
    });

    //Cadastro para login
    $(".btn_atvt_login").click(function () {
        $(".tela_cadastro").hide();
    });

    // Efeito formulario
    $("input").focus(function () {
        $(this).parent().find("label").css({
            fontSize: "0.7em",
            left: "0px",
            bottom: "30px",
            transition: "all 0.3s"
        });
    });

    $("input").focusout(function () {
        if ($(this).val() == null || $(this).val() == "") {
            $(this).parent().find("label").css({
                fontSize: "1em",
                left: "0px",
                bottom: "10px",
                transition: "all 0.3s"
            });
        }
    });


    //Carregar msg
    function carregarMSG(){
        var $ultima_msg;
        $msgs = setInterval(function(){
            $ultima_msg = $(".esqueleto_msg").last().find(".texto_msg").html();
            $.ajax({
                type: 'post',
                url: '//app.messengerblue.rf.gd/api/1.0/bus_msg.php',
                data: {idcanal: $canal_selecinado, tipo_load: 'ultma', ultima_msg: $ultima_msg},
                success: function(msg_recebido){
                    $(".msg_tudo_aqui").append(msg_recebido);
                    $tamanho = $(".msg_tudo_aqui").height();
                    $(".campo_mgs_recebido").scrollTop($tamanho);
                },
                error: function(){
                    swal({
                        text: "Não foi possivel buscar mensagens",
                        type: "error"
                    });
                }
            });
        }, 3000);
    }

    //Menu Lateral
    $(".btn_menu").click(function () {
        if ($(this).hasClass("aberto")) {
            $(".menu_lateral").animate({
                left: '0'
            }, 100);
            $(this).removeClass("aberto").css({
                transform: 'rotate(48deg)',
                border: 'none',
                transition: 'all 0.5s'
            });
            $(".titulo_app").fadeOut(200);
            $(".titulo_canal").delay(200).fadeIn(200);
        } else {
            $(this).addClass("aberto").css({
                transform: 'rotate(0deg)',
                borderRight: '1px solid rgba(0, 0, 0, 0.30)',
                transition: 'all 0.5s'
            });
            $(".titulo_canal").fadeOut(200);
            $(".titulo_app").delay(200).fadeIn(200);
            $(".menu_lateral").animate({
                left: '-100%'
            });
        };
    });

    //Carregar Canais
    var $canal_selecinado;
    if (localStorage.getItem("ultimo_canal_selecinado") != null) {
        $canal_selecinado = localStorage.getItem("ultimo_canal_selecinado");
        $.ajax({
            type: 'post',
            url: '//app.messengerblue.rf.gd/api/1.0/bus_msg.php',
            data: {idcanal: $canal_selecinado, tipo_load: 'todos'},
            success: function(msg_recebido){
                $(".msg_tudo_aqui").html(msg_recebido);
                $tamanho = $(".msg_tudo_aqui").height();
                $(".campo_mgs_recebido").scrollTop($tamanho);
                carregarMSG();
            },
            error: function(){
                swal({
                    text:"Não foi possivel buscar mensagens, por favor, verifiquue sua conexão"
                });
            }
        });
    }
    $.ajax({
        type: 'post',
        url: '//app.messengerblue.rf.gd/api/1.0/canais.php',
        success: function (dados) {
            $(".canal_msg").append(dados);
            // Espaco MSG

            $verifiCanal = setInterval(function () {
                if($(".tela_inicial").is(':visible')){
                    if ($canal_selecinado == null || $canal_selecinado == "") {
                        $(".menu_lateral").animate({
                            left: '0'
                        }, 100);
                        $(".btn_menu").removeClass("aberto").css({
                            transform: 'rotate(48deg)',
                            border: 'none',
                            transition: 'all 0.5s'
                        });
                        $(".titulo_app").fadeOut(200);
                        $(".titulo_canal").delay(200).fadeIn(200);
                    }else{
                        clearInterval($verifiCanal);
                    }
                }
            }, 300);
            $(".esqueleto_canal").click(function () {
                $canal_selecinado = $(this).find(".nome_canal").attr("idcanal");
                localStorage.setItem("ultimo_canal_selecinado", $canal_selecinado);
                $(".btn_menu").addClass("aberto").css({
                    transform: 'rotate(0deg)',
                    borderRight: '1px solid rgba(0, 0, 0, 0.30)',
                    transition: 'all 0.5s'
                });
                $(".titulo_canal").fadeOut(200);
                $(".titulo_app").delay(200).fadeIn(200);
                $(".menu_lateral").animate({
                    left: '-100%'
                });
                $.ajax({
                    type: 'post',
                    url: '//app.messengerblue.rf.gd/api/1.0/bus_msg.php',
                    data: {idcanal: $canal_selecinado, tipo_load: 'todos'},
                    success: function(msg_recebido){
                        $(".msg_tudo_aqui").html(msg_recebido);
                        $tamanho = $(".msg_tudo_aqui").height();
                        $(".campo_mgs_recebido").scrollTop($tamanho);
                        carregarMSG();
                    },
                    error: function(){
                        swal({
                            text: "Não foi possivel buscar mensagens"
                        });
                    }
                });
            });
        },
        error: function (erro) {
            swal({
                text: "Erro ao carregar canais",
                type: "error"
            });
        }
    });

    $(".btn_envi_msg").click(function(){
        $texto = $(".escreve_msg").html();
        $.ajax({
            type: 'post',
            url: '//app.messengerblue.rf.gd/api/1.0/envi_msg.php',
            data: {texto: $texto, de_user: $username, canal: $canal_selecinado},
            success: function(){
                $(".escreve_msg").html("");
            },
            error: function(){
                swal({
                    text: "Não foi possivel enviar a mensagem: " + $texto,
                    type: "error"
                });
            }
        });
    });

});

function logout(){
    localStorage.removeItem("username");
    localStorage.removeItem("ultimo_canal_selecinado");
    $(".tela_all").hide();
    $(".tela_login").show();
}