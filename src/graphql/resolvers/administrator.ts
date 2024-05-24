  @UseMiddleware(trackLogMiddleware, authMiddleware)
  @Mutation(() => UsuarioModel)
  async SetUsuarioAdmin(
    @Arg("usuario") usuario: usuario,
    @Ctx() context: Context
  ) {
    if (context.user.empresa_usuario[0].tipo_usuario !== "ADMIN") {
      throw new Error("Sem premissão para essa ação.");
    }
    const userExists = await UsersService.emailValid(usuario.email);

    if (userExists.emailValid !== false) {
      throw new Error("Usuario já cadastrado com esse email.");
    }
    const pass = Math.random().toString(36).slice(-10);
    const pwd = await bcryptjs.hash(pass, 10);
    const uuid = v4();

    const save = await UsersService.create(usuario, pwd, uuid);

    if (save) {
      const empresa = await EmpresaUsuarioServices.create({
        id_empresa: context.user.empresa_usuario[0].id_empresa,
        id_user: save.id,
        edicao: usuario.edicao,
        exclusao: usuario.exclusao,
        visualizacao: usuario.visualizacao,
      });

      const mailBody = `<p>Olá ${save.name} ,</p>
      
      <p>Seja bem-vindo à Urbit!</p>
      
      <p>A URBIT é uma empresa de tecnologia que organiza informações territoriais para tomadas de decisões de investimentos imobiliários.</p>
      
      <p>Se você quer ganhar tempo e assertividade em estudos de mercados, avaliação de imóveis e prospecção de áreas, está no lugar certo!</p>
      
      <p>A URBIT fornece dados em API e uma plataforma sob assinatura para diversas finalidades, que incluem:</p>
      
      <ul>
        <li>Gestão de terrenos</li>
        <li>Prospecção de áreas</li>
        <li>Estudos de mercados</li>
        <li>Avaliação de imóveis</li>
      </ul>
      <p>São dados de preços de imóveis, serviços, infraestrutura urbana e legislação urbanística de diversas regiões do Brasil. </p>
      
      <p>Caso tenha interesse em saber mais sobre nossos serviços, agende uma vídeo-conferência <a href="https://calendly.com/fernando-urbit/dados-e-mercado-urbit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://calendly.com/fernando-urbit/dados-e-mercado-urbit&amp;source=gmail&amp;ust=1692664219273000&amp;usg=AOvVaw3YdIhLweX3T00svyp_QRjc">aqui</a>. </p>

      <p>Sua senha temporaria é: ${pass} </p>
      <p>Recomendamos que altere no momento em que faça login na plataforma </p>
      
      <p>Estamos à disposição para esclarecimentos. </p>
      
      <p>Um abraço. </p>
      
      <p>Equipe Urbit </p>`;

      const mailSubject = `Seja bem-vindo à Urbit!`;

      const queue = new MailQueue();

      queue.SetMailQueue({
        assunto: mailSubject,
        corpo: mailBody,
        id: 0,
        email: save.email,
        data_cadastro: "",
        data_envio: "",
        situacao_envio: "",
        origem: "APP",
      });

      save["visualizacao"] = empresa.visualizacao;
      save["edicao"] = empresa.edicao;
      save["exclusao"] = empresa.exclusao;

      return save;
    } else {
      throw new Error("Não foi possivel salvar o usuario");
    }
  }

  @UseMiddleware(trackLogMiddleware)
  @Mutation(() => UsuarioModel)
  async SetUsuario(@Arg("usuario") usuario: usuario) {
    const userExists = await UsersService.emailValid(usuario.email);

    if (userExists.emailValid !== false) {
      throw new Error("Usuario já cadastrado com esse email.");
    }

    const pwd = await bcryptjs.hash(usuario.password, 10);
    const uuid = v4();

    const save = await UsersService.create(usuario, pwd, uuid);


     
      return save;
    } else {
      throw new Error("Não foi possivel salvar o usuario");
    }
  }