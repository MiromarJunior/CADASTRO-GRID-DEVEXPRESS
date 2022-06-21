import { useContext, useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState,SortingState,
    IntegratedSorting,
    IntegratedFiltering,
    FilteringState, } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableFilterRow,
    
  } from '@devexpress/dx-react-grid-bootstrap4';
import { deleteSeguradoraID, getSeguradora } from "../../Service/seguradoraService";
import { Button } from "react-bootstrap";



const getRowId = row => row.id;

const ListarSeguradora =()=> {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout } = useContext(AuthContext);
   

    

   
    useEffect(() => {        
        listarSeguradoras();        
    }, []);

    const listarSeguradoras = async ()=> {      
        let dados = { token };
      await  getSeguradora(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                }
                else if (res.data === "semAcesso") {
                    alert("Usuário sem permissão !!!");

                } else if (res.data === "campoNulo") {
                    alert("Preencha todos os Campos obrigatorios!!!");
                }
                else if (res.data === "erroSalvar") {
                    alert("Erro a tentar salvar ou alterar!!!");
                }
                else {                 
                    (res.data).forEach((item, index) => (item.id = index));                 
                  return  setRows(res.data);
                }
            })
            .catch((res) => {
              return  console.log(res);
            })
    };

    const deletarSeguradora = (idSeg) => {        
        let dados = { idSeg, token };      
        if (window.confirm("deseja excluir o item ?")) {
            deleteSeguradoraID(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        alert("Sessão expirada, Favor efetuar um novo login !!");
                        logout();
                        window.location.reload();
                    }
                    else if (res.data === "semAcesso") {
                        alert("Usuário sem permissão !!!");
    
                    } else if (res.data === "campoNulo") {
                        alert("Preencha todos os Campos obrigatorios!!!");
                    }
                    else if (res.data === "erroSalvar") {
                        alert("Erro a tentar salvar ou alterar!!!");
                    }    
                    else {                       
                        listarSeguradoras();
                    }
                })
                .catch((res) => {
                    console.error(res);
                    window.alert("Erro ao tentar exluir seguradora");
                })
        }

    };
 
    const [columns] = useState([ 
       { name: 'SGRA_CNPJ', title: "CNPJ"},
        { name: 'SGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL"},
         { name: 'SGRA_CIDADE', title: "CIDADE" },
         {name : "ALTERACAO", title :"ALTERAÇÃO",                
         getCellValue: row => (row.ID_SEGURADORA)  
           
    },      

    ]);

   const [editingStateColumns] = useState([
    // {columnName : "SGRA_CNPJ",editingEnabled: false},
    // {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
    // {columnName : "PRDT_VALOR",align: 'center'},

   ])

   
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

     
 
      const EditSeguradoras = ({value})=>(
        <div>
            <Button variant="info" className="margemRight"onClick={(e)=>navigate(`/cadastroSeguradora/${value}`)}>EDIT</Button> 
           <Button variant="danger" className="margemRight" onClick={(e)=>deletarSeguradora(value)}>EXCLUIR</Button> 
        </div>       
       
       )    
       const EditSeguradorasProv = props =>(
        <DataTypeProvider
            formatterComponent={EditSeguradoras}
            {...props}        
        />
       )
    const [editSeg] = useState(["ALTERACAO"]);       

    const [integratedSortingColumnExtensions] = useState([
        { columnName: 'SGRA_CNPJ' },
      ]);
  
    

    return (
        <div className="container-fluid">

            <h1>Listar Produtos</h1>

            <div style={{marginBottom : "10px"}} >
                {/* <button onClick={() => navigate("/home")}  > HOME</button> */}
                {/* <button className="btn btn-outline-primary margemRight" onClick={(e)=>navigate("/cadastroSeguradora/0")}>CADASTRAR UNIDADE EMPRESARIAL</button>           
                <button className="btn btn-outline-danger margemRight" onClick={(e) => logout(e)}  > SAIR</button> */}
            </div>


            <div className="card">
      <Grid
        rows={rows}        
        columns={columns}
        getRowId={getRowId}
      >
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        
         <SortingState 
       //  defaultSorting={[{ columnName: 'ALTERACAO', direction: 'asc' }]}
         />
         <IntegratedSorting
           columnExtensions={integratedSortingColumnExtensions}
        />
        <EditingState
        
          columnExtensions={editingStateColumns}
        />
        <EditSeguradorasProv
        for={editSeg}
        
        />
        
        <Table  />
        <TableHeaderRow  showSortingControls />
        <TableEditRow />
        <TableFilterRow />
       
        
      </Grid>
    </div>


        </div>

    )

}

export default ListarSeguradora;