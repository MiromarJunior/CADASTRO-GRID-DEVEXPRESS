const { useContext, useState } = require("react");
const { useNavigate } = require("react-router-dom");
const { AuthContext } = require("../Autenticação/validacao");
const avvante = require("../img/avvante60.png");

require("./Login.css");



function LoginPage(){
    

    const [usuario,setUsuario] = useState("");
    const [senha,setSenha] = useState(""); 
    const navigate = useNavigate();
    const {login} =useContext(AuthContext);

    function acessoLogin(e){
        e.preventDefault();
       login(usuario,senha);
    }
    




    return(
        <div>
            





                <div className="container-fluid">
		<div className="row main-content bg-success text-center">
			<div className="col-md-4 text-center company__info">
				<span className="company__logo"><h2><span className="fa fa-android"></span></h2></span>
				<h4 className="company_title"></h4>
                <img src={avvante}/>
			</div>
			<div className="col-md-8 col-xs-12 col-sm-12 login_form ">






                
				<div className="container-fluid">
					<div className="row">
						<h2>Acesso ao Sistema</h2>
					</div>
					<div className="row">
						<form control="" className="form-group">
							<div className="col" >    
                            <label id="label_Login"><b>Usuário</b> </label>                         
								<input onChange={(e)=> setUsuario(e.target.value)} type="text" name="username" id="username" className="form__input" placeholder="Usuário"/>
							</div>
                          

							<div className="col">
                            <label style={{marginRight : "30px"}}><b>Senha</b> </label>  
								<input onChange={(e)=> setSenha(e.target.value)} type="password" name="password" id="password" className="form__input" placeholder="Senha"/>
							</div>
                          
                            
							
							<div className="row">
                            <button style={{marginLeft : "90px"}} className="btnL" onClick={(e)=>acessoLogin(e)}>Login</button>
							</div>
						</form>
					</div>
					
					
				</div>
			</div>
		</div>
	</div>















                
            </div>

    
    )
}
export default LoginPage;



/**
 * 
 * 
 * 
 * 
 * 
 * <div className="row" style={{fontSize : 11}}  >
						<p>Ainda não tem cadastro ? <button style={{maxWidth : "150px"}} className="btnL" onClick={(e)=>navigate("/cadastroUsuario")}>Cadastrar novo Usuário</button>
						</p></div>

  <div className="col">
                            <label style={{marginRight : "35px"}}><b>CNPJ</b> </label>  
								<input onChange={(e)=> setSenha(e.target.value)} type="text" name="" id="" className="form__input" placeholder="CNPJ"/>
							</div>
                            <div className="col">
                            <label id="label_Login" ><b>Grupo</b> </label> 
								<select className="form__input"  >
                                    <option>Matriz</option>
                                    <option>Regional</option>
                                    <option>Fonecedor</option>
                                    <option>Bate-Pronto</option>
                                    <option>Central</option>

                                </select>
							</div>
                            <div className="col">
                            <label style={{marginLeft : "-20px", marginRight : "20px"}}><b>Categoria</b> </label> 
								<select className="form__input"  >
                                    <option>Admin Sistemas</option>
                                    <option>Admin</option>
                                    <option>Gestor</option>
                                    <option>Operacional</option>
                                   

                                </select>
							</div>




 <h1> Pagina de Login</h1>
            <div className="centralizarInput">
                <form>
                    <label>Usuário</label><br/>
                    <input type={"text"} onChange={(e)=> setUsuario(e.target.value)} placeholder={"Nome o usuário"}/><br/>
                    <label>Senha</label><br/>
                    <input type={"password"} onChange={(e)=> setSenha(e.target.value)} placeholder={"Senha"} />
                </form>
                <br/>
                <button onClick={(e)=>acessoLogin(e)}>Login</button>
                <button onClick={(e)=>navigate("/cadastroUsuario")}>Cadastrar novo Usuário</button>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="author" content="Yinka Enoch Adedokun">
	<title>Login Page</title>
</head>
<body>
	<!-- Main Content -->
	<div class="container-fluid">
		<div class="row main-content bg-success text-center">
			<div class="col-md-4 text-center company__info">
				<span class="company__logo"><h2><span class="fa fa-android"></span></h2></span>
				<h4 class="company_title">Your Company Logo</h4>
			</div>
			<div class="col-md-8 col-xs-12 col-sm-12 login_form ">
				<div class="container-fluid">
					<div class="row">
						<h2>Log In</h2>
					</div>
					<div class="row">
						<form control="" class="form-group">
							<div class="row">
								<input type="text" name="username" id="username" class="form__input" placeholder="Username">
							</div>
							<div class="row">
								<!-- <span class="fa fa-lock"></span> -->
								<input type="password" name="password" id="password" class="form__input" placeholder="Password">
							</div>
							<div class="row">
								<input type="checkbox" name="remember_me" id="remember_me" class="">
								<label for="remember_me">Remember Me!</label>
							</div>
							<div class="row">
								<input type="submit" value="Submit" class="btn">
							</div>
						</form>
					</div>
					<div class="row">
						<p>Don't have an account? <a href="#">Register Here</a></p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Footer -->
	<div class="container-fluid text-center footer">
		Coded with &hearts; by <a href="https://bit.ly/yinkaenoch">Yinka.</a></p>
	</div>
</body>















 */