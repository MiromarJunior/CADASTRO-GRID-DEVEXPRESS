import { useNavigate } from "react-router-dom";


const HomePage = ()=>{
    const navigate = useNavigate();

    

    



    return(
        <div>
           <h1> Seja bem vindo !!!</h1>


           <div className="centralizar">
           <button onClick={()=>navigate("/listarProdutos")}  > LISTAR PRODUTOS</button>
           </div>


        </div>

    )

}

export default HomePage;