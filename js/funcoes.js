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
            url: 'http://kmessenger.esy.es/msgblue/cadastro.php',
            data: { unome: $unome, senha: $senha },
            success: function (dados) {
                if (dados == "sucesso") {
                    alert("Cadastrado com sucesso!");
                } else if (dados == "ja cadastrado") {
                    alert("Ja Ã¡ um cadastro com esse username");
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
            url: 'http://kmessenger.esy.es/msgblue/login.php',
            data: { unome: $unome, senha: $senha },
            success: function (dados) {
                if (dados == "logado") {
                    $(".tela_all").hide();
                    $(".tela_inicial").show();
                    alert($username);
                } else if (dados == "n_cadastrado") {
                    alert("Usuario nÃ£o encontrado");
                } else if (dados == "n_senha") {
                    alert("Senha incorreta");
                };
            },
        });

        return false;
    });

    //Login para cadastro
    $(".btn_atvt_cadastro").click(function () {
        $(".tela_login").hide();
        $(".tela_cadastro").show();
    });

    //Cadastro para login
    $(".btn_atvt_login").click(function () {
        $(".tela_cadastro").hide();
        $(".tela_login").show();
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
    $.ajax({
        type: 'post',
        url: 'http://kmessenger.esy.es/msgblue/canais.php',
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
                    url: 'http://kmessenger.esy.es/msgblue/bus_msg.php',
                    data: {idcanal: $canal_selecinado, tipo_load: 'todos'},
                    success: function(msg_recebido){
                        $(".msg_tudo_aqui").html(msg_recebido);
                        $tamanho = $(".msg_tudo_aqui").height();
                        $(".campo_mgs_recebido").scrollTop($tamanho);
                        carregarMSG();
                    },
                    error: function(){
                        alert("NÃ£o foi possivel buscar mensagens");
                    }
                });
                function carregarMSG(){
                    var $ultima_msg;
                    $msgs = setInterval(function(){
                        $ultima_msg = $(".esqueleto_msg").last().find(".texto_msg").html();
                        $.ajax({
                            type: 'post',
                            url: 'http://kmessenger.esy.es/msgblue/bus_msg.php',
                            data: {idcanal: $canal_selecinado, tipo_load: 'ultma', ultima_msg: $ultima_msg},
                            success: function(msg_recebido){
                                $(".msg_tudo_aqui").append(msg_recebido);
                                $tamanho = $(".msg_tudo_aqui").height();
                                $(".campo_mgs_recebido").scrollTop($tamanho);
                            },
                            error: function(){
                                alert("NÃ£o foi possivel buscar mensagens");
                            }
                        });
                    }, 3000);
                }
            });
        },
        error: function (erro) {
            alert("Erro ao carregar canais");
        }
    });

    $(".btn_envi_msg").click(function(){
        $texto = $(".escreve_msg").html();
        $.ajax({
            type: 'post',
            url: 'http://kmessenger.esy.es/msgblue/envi_msg.php',
            data: {texto: $texto, de_user: $username, canal: $canal_selecinado},
            success: function(){
                $(".escreve_msg").html("");
            },
            error: function(){
                alert("NÃ£o foi possivel enviar a mensagem: " + $texto);
            }
        });
    });

});