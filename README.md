# PROJETO-CADASTRO-GRID
Prejeto Cadastro Utilizando AG GRID


# BACK-END
componentes utilizados<br/>
express<br/>
jsonwebtoken<br/>
oracledb<br/>
bcrypt


<h3>configDB.js</h3>
Método para conectar com banco de dados Oracle

<h3>produtoController.js</h3>

/listarProduto lista todos produtos cadastrados<br/>
/excluirProduto exclui os produtos recebidos pelo nr ID<br/>
/editarListaProdutos nesse método recebemos a lista de produtos do front-end
com novos produtos, e também alterações dos produtos ja exitentes.


<h3>usuarioController.js</h3>

/cadastrarUsuario recebe dados do fornt-end para cadastrar um novo usuário, 
mas antes verifica se o nome e cpf já estão cadastrados no banco.<br/>

/loginUsuario recebe o usuario e senha e faz a comparação para validar o login 
e responde com os dados de autenticação
 exclui os produtos recebidos pelo nr ID


# FRONT-END