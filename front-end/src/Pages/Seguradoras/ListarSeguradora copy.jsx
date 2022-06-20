import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {useNavigate } from "react-router-dom";
import apiProdutosService, { dataFormatadaListar, updateListaProd } from "../../Service/produtoService";
import { criando, formataValorString, valorBR, valorLiquido } from "../../Service/utilServiceFrontEnd";
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
  } from '@devexpress/dx-react-grid-bootstrap4';
import { deleteSeguradora, deleteSeguradoraID, getContatoSeguradora, getSeguradora } from "../../Service/seguradoraService";
import { Button } from "react-bootstrap";



const getRowId = row => row.id;

const ListarSeguradora =()=> {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout } = useContext(AuthContext);
    //const [desconto, setdesconto] = useState([]);
    const gridRef = useRef();

    const deletarSeguradora = (idSeg) => {
        
        let dados = { idSeg, token };
      
        if (window.confirm("deseja excluir o item ?")) {
            deleteSeguradoraID(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        window.alert("Sessão expirada, Favor efetuar um novo login");
                        logout();
                    } else {
                        alert(res.data);
                        listarSeguradoras();
                    }
                })
                .catch((res) => {
                    console.log(res);
                })
        }

    };

 
 
    const [columns] = useState([ 
       { name: 'SGRA_CNPJ', title: "CNPJ"},
        { name: 'SGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL"},
         { name: 'SGRA_CIDADE', title: "CIDADE" },
         {name : "ALTERACAO", title :"ALTERAÇÃO",                
         getCellValue: row => (row.ID_SEGURADORA)  ,
           
    },      

    ]);

   const [editingStateColumns] = useState([
    {columnName : "SGRA_CNPJ",editingEnabled: false},
    {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
    {columnName : "PRDT_VALOR",align: 'center'},

   ])




   const [columnsC] = useState([ 
    { name: 'SGCO_NOME', title: "NOME"},
     { name: 'SGCO_FUNCAO', title: "FUNÇÃO"},
      { name: 'SGCO_DEPARTAMENTO', title: "DEPARTAMENTO" }        

 ]);
   
//    const PriceFormatter = ({value})=>(
//     valorBR(value)
//    )

//    const PriceProvider = props =>(
//     <DataTypeProvider
//         formatterComponent={PriceFormatter}
//         {...props}
    
//     />
//    )
 

  
//    const [priceColumns] = useState(["PRDT_VALOR","PRDT_VALOR_LIQUIDO"]);

    useEffect(() => {
        listarSeguradoras();
        
    }, []);



    const buscarContatos =(idSeg)=>{
        const dados = {token,idSeg}       
            getContatoSeguradora(dados)
            .then((res)=>{
                    
              
            });
    
    }



    const listarSeguradoras = ()=> {
        //  setdataN(new Date());
        let dados = { token };
        getSeguradora(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login");
                 return   logout();
                } else {                   
                    (res.data).forEach((item, index) => (item.id = index));                 
                  return  setRows(res.data);
                }
            })
            .catch((res) => {
              return  console.log(res);
            })
    };

 

   
 
      const EditSeguradoras = ({value})=>(
        <div>
          

        </div>       
       
       )    
       const EditSeguradorasProv = props =>(
        <DataTypeProvider
            formatterComponent={EditSeguradoras}
            {...props}        
        />
       )

    const [editSeg] = useState(["ALTERACAO"]);
  
    

    return (
        <div className="container-fluid">

            <h1>Listar Produtos</h1>

            <div className="centralizar">
                <button onClick={() => navigate("/home")}  > HOME</button>
                <button onClick={(e)=>navigate("/cadastroSeguradora/0")}>CADASTRAR UNIDADE EMPRESARIAL</button>           
                <button onClick={(e) => logout(e)}  > SAIR</button>
            </div>


            <div className="card">
      <Grid
        rows={rows}
        
        columns={columns}
        getRowId={getRowId}
      >
        <EditingState
        //   onCommitChanges={commitChanges}
          columnExtensions={editingStateColumns}
        />
        <EditSeguradorasProv
        for={editSeg}
        
        />
        
        <Table  />
        <TableHeaderRow />
        <TableEditRow />
        {/* <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          
        /> */}
        
      </Grid>
    </div>


        </div>

    )

}

export default ListarSeguradora;