# PROJETO-CADASTRO-GRID
Projeto Cadastro Utilizando DEVEXPRESS

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
com novos produtos, e também alterações dos produtos já existentes.

<h3>usuarioController.js</h3>

/cadastrarUsuario recebe dados do front-end para cadastrar um novo usuário, mas antes verifica se o nome e cpf já estão cadastrados no banco.<br/>

/loginUsuario recebe o usuário e senha e faz a comparação para validar o login e responde com os dados de autenticação 


# FRONT-END
Componentes utilizados<br/>
react-router-dom<br/>
axios<br/>
cpf-cnpj-validator
telefone
react-bootstrap

<h3>validacao.js</h3>
Pagina para enviar dados para back-end e receber de volta criando uma sessão para acesso entre as páginas

<h3>produtoService.js</h3>
Página utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos produtos

<h3>usuarioService.js</h3>
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários

<h3>utilServiceFrontEnd.js</h3>
Métodos padrões para utilizar em todo front-end

<h3>AppRotas.js</h3>
Página recebe dados da autenticação e faz a liberação e controle da navegação entre as páginas

<h3>Login.jsx</h3>
Envia dados para o login controller para efetuar a validação de acesso do usuário

<h3>ListarProdutos.jsx</h3>
Utilizando o sistema de GRID, listamos, editamos e cadastramos novos produtos.

<h3>CadastroUsuario.jsx</h3>
Envia os dados para o usuário controller cadastrar um novo usuário

<h3>CadastrarUniEmp.jsx</h3>
Pagina em construção para cadastrar uma nova unidade empresarial
