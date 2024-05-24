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

      
      return save;
    } else {
      throw new Error("Não foi possivel salvar o usuario");
    }
  }
