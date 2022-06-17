/**
 * Envia os dados para o usuário controller cadastrar um novo usuário
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUsuario } from "../../Service/usuarioService";

const CadastroUsuario =()=>{

    const [nome, setNome]=useState("");
    const [usuario, setUsuario]=useState("");
    const [dataNasc, setDataNasc]=useState("");
    const [senha, setSenha]=useState("");
    const [cpf, setCpf]=useState("");
    const navigate = useNavigate();





    const cadastraUsuario =(e)=>{
        e.preventDefault();
        let dados = {nome, usuario, dataNasc , senha, cpf};
        saveUsuario(dados)
        .then((res)=>{
            window.alert(res.data);
        })
        .catch((err)=>{
            console.log(err);
            window.alert("Erro ao cadastrar !!")
        })
    }
    return(
        <div>
            <div className="centralizarInput">       
                <form >                  
                    <label>Nome Completo</label><br/>
                    <input onChange={(e)=>setNome(e.target.value)} type={"text"} placeholder={"Nome Usuário"} />
                    <br/>
                   
                   
                    <label>CPF</label><br/>
                    <input onChange={(e)=>setCpf(e.target.value)} type={"text"} placeholder={"CPF Apenas números"} />
                    <br/>
                 
                  
                    <label>Data Nascimento</label><br/>
                    <input onChange={(e)=>setDataNasc(e.target.value)} style={{width : '13.55%'}} type={"date"} placeholder={"Data Nascimento"} />
                    <br/>
                    <label>Usuário</label><br/>
                    <input onChange={(e)=>setUsuario(e.target.value)} type={"text"} placeholder={"Usuário"} />
                    <br/>
                    <label>Senha</label><br/>
                    <input onChange={(e)=>setSenha(e.target.value)} type={"password"} placeholder={"Senha"} />
                    <br/>
                    
                    
                </form> <br/>
                <button onClick={(e)=> cadastraUsuario(e)}>CADASTRAR USUÁRIO</button>
                <button onClick={()=>navigate("/")}  > LOGIN</button>

            </div>
        </div>
    )

}

export default CadastroUsuario;