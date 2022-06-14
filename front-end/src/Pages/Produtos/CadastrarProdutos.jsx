import { useContext, useEffect, useState } from "react";
import apiProdutosService from "../../Service/produtoService";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
const token  = localStorage.getItem("token");
const CadastrarProdutos = ()=>{

    const [descricao,setDescricao] = useState("");
    const [codigo, setCodigo] = useState("");
    const [valor, setValor] = useState("");
    const [dataVal, setDataVal] = useState("");
    const {id} = useParams();
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        buscarProdutoID();
      
    }, []);


    const cadastrarProduto =(e)=>{
        e.preventDefault();
        const dados = {descricao, codigo,valor,dataVal,id,token};
        apiProdutosService.saveProdutos(dados)
        .then((res)=>{
            if(res.data === "erroLogin"){
                alert("Sessão expirada ! Favor efetuar um novo login");
                logout();
            }
            alert(res.data);
            navigate("/listarProdutos");


        }).catch((err)=>{
            console.log(err);
        })

    }

    const buscarProdutoID = ()=>{
        let dados = {id};
        apiProdutosService.getProdutosID(dados)
        .then((res)=>{
            
            (res.data).forEach((a)=>{
                setCodigo(a.PRDT_CODIGO);
                setDataVal(apiProdutosService.dataFormatadaInput(a.PRDT_DT_VALIDADE) );
                setDescricao(a.PRDT_DESCRICAO);
                setValor(a.PRDT_VALOR);

            })

        })

    }
    
    


    return(

        <div>
           
           <h1>{id === "0" ? "Cadastrar Produtos" : "Atualizar Produtos"} </h1>
            <form className="centralizarInput">
            <label>Descrição</label>  <br />               
            <input  type={'text'} value={descricao} onChange={(e)=> setDescricao(e.target.value) }   />            
            <br />
            
            <label>Codigo</label><br />
            <input type="text"  value={codigo} onChange={(e)=> setCodigo(e.target.value) }/>
            <br />
          
            <label>Valor</label><br />
            <input type={'text'} value={(valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} onChange={(e)=> setValor(e.target.value) }/>
            <br />
            <label>DATA VALIDADE</label><br />
            <input style={{width : '13.55%'}} type={'date'} value={dataVal} onChange={(e)=> setDataVal(e.target.value) } />
            </form><br />            
         
            <div className="centralizar">
            <button onClick={(e)=>cadastrarProduto(e) }   >SALVAR PRODUTOS</button>

            <button onClick={()=>navigate("/listarProdutos")}  > LISTAR PRODUTOS</button>
            <button onClick={(e)=>logout(e)}  > SAIR</button>
            </div>




        </div>

    )

}

export default CadastrarProdutos;