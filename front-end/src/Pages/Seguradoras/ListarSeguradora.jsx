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
    
  } from '@devexpress/dx-react-grid-material-ui';
import { deleteSeguradoraID, getSeguradora } from "../../Service/seguradoraService";
import { Button } from "react-bootstrap";
import { cnpj } from "cpf-cnpj-validator";
import ViewListIcon from '@mui/icons-material/ViewList';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';



const getRowId = row => row.id;

const ListarSeguradora =()=> {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout } = useContext(AuthContext);
      

   
    useEffect(() => {    
      
        
        
        listarSeguradoras();        
    }, [logout,token]);

    const listarSeguradoras =  ()=> {      
        let dados = { token };
        getSeguradora(dados)
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
              return  console.error(res);
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
                    
                })
                .catch((res) => {
                    console.error(res);
                    window.alert("Erro ao tentar excluir seguradora");
                })
        }

    };
 
    const element = <AddCircleOutlinedIcon fontSize="large" style={{color : "blue"}} type="button" onClick={()=>navigate("/cadastroSeguradora/0")}/>
    const [columns] = useState([ 
       { name: 'SGRA_CNPJ', title: `CNPJ`},
        { name: 'SGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL"},
         { name: 'SGRA_CIDADE', title: "CIDADE" },
         {name : "ALTERACAO", title : element,                
         getCellValue: row => (row.ID_SEGURADORA)  
           
    },      

    ]);

   const [editingStateColumns] = useState([
     {columnName : "ALTERACAO",editingEnabled: false},
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

         const ValidCnpj = ({value})=>(       
        cnpj.format(value)
    )
    const ValidCnpjProv = (props)=>(
        <DataTypeProvider
        formatterComponent={ValidCnpj}
        {...props}

        />
    )
    const [validCNPJ] = useState(["SGRA_CNPJ"]);
 
      const EditSeguradoras = ({value})=>(
        <div>
 <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} className="margemRight" onClick={(e)=>navigate(`/cadastroSeguradora/${value}`)} type="button"/>
<DeleteForeverOutlinedIcon type="button" fontSize="medium"  style={{ color: "red" }} onClick={(e)=>deletarSeguradora(value)}/>
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

            <h3 className="centralizar">SEGURADORAS</h3>

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
       //  defaultSorting={[{ columnName: 'ALTERACAO', sortingEnabled: false }]}
       columnExtensions={editingStateColumns}
     
       
         />
         <IntegratedSorting
          // columnExtensions={integratedSortingColumnExtensions}
         
        />
        <EditingState
        
          columnExtensions={editingStateColumns}
        />
        <EditSeguradorasProv
        for={editSeg}          
        />
        <ValidCnpjProv
         for={validCNPJ}   
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