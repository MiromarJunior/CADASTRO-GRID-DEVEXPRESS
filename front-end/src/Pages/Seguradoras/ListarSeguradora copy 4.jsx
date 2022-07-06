import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import {
    DataTypeProvider, EditingState, SortingState,
    IntegratedSorting,
    IntegratedFiltering,
    FilteringState,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableFilterRow,

} from '@devexpress/dx-react-grid-material-ui';
import { deleteSeguradoraID, getSeguradora } from "../../Service/seguradoraService";
import { cnpj } from "cpf-cnpj-validator";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";



// const TableComponent = ({ ...restProps }) => (
//     <Table.Table
//         {...restProps}
//     />
// );

const TableComponentTitle = ({ style, ...restProps }) => (
    <TableHeaderRow.Content
        {...restProps}
        style={{
            color: 'black',
            fontWeight: "bold",
            ...style,
        }}
    />
);
const ValidCnpj = ({ value }) => (
    cnpj.format(value)
)
const ValidCnpjProv = (props) => (
    <DataTypeProvider
        formatterComponent={ValidCnpj}
        {...props}

    />
)




let acessoGeral = false;
const getRowId = row => row.id;
const ListarSeguradora = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [validCNPJ] = useState(["SGRA_CNPJ"]);
    const [editSeg] = useState(["ALTERACAO"]);
    // const [acessoGeral, setAcessoGeral] = useState(false);
     const [acessoCAD, setAcessoCAD] = useState(false);    


    useEffect(() => {      
            const acessoMenuUser =  ()=>{
              let dados = { token, usuario :nomeUser() };
               getAcessoUserMenu(dados)
                .then((res) => {
                  if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                  }
                  else if (res.data === "semAcesso") {
                    window.alert("Usuário sem permissão !!!");          
                  } else {
                    (res.data).forEach((l)=>{
                  
                      if(process.env.REACT_APP_API_ACESSO_GERAL || process.env.REACT_APP_API_ACESSO_CAD === l.ACES_DESCRICAO){
                        acessoGeral = true;
                        setAcessoCAD(true); 
                        console.log(l);
                                                
                  
                      }         
      
                    })
                    
                  }
          
          
                })
                .catch((err) => {
                  console.error(err);
                  window.alert("Erro ao cadastrar !!")
                })
          
            }
      
      
            acessoMenuUser();             
        

       
    }, [logout, token,nomeUser]);

useEffect(()=>{
    
    const listarSeguradoras =  (acessoGeral) => {
        let dados = { token, acessoGeral };
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
                    return setRows(res.data);
                }
            })
            .catch((res) => {
                return console.error(res);
            })
    };
listarSeguradoras();

},[])



    const deletarSeguradora = (idSeg) => {
        let dados = { idSeg, token,acessoGeral };
        if (window.confirm("deseja excluir o item ?")) {
            deleteSeguradoraID(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        window.alert("Sessão expirada, Favor efetuar um novo login !!");
                        logout();
                        window.location.reload();
                    }
                    else if (res.data === "semAcesso") {
                        window.alert("Usuário sem permissão !!!");

                    } else if (res.data === "campoNulo") {
                        window.alert("Preencha todos os Campos obrigatorios!!!");
                    }
                    else if (res.data === "erroSalvar") {
                        window.alert("Erro a tentar salvar ou alterar!!!");
                    }
                    else if (res.data === "sucesso") {
                        window.alert("Seguradora Excluída com Sucesso!!!");
                      
                    }

                })
                .catch((res) => {
                    console.error(res);
                    window.alert("Erro ao tentar excluir seguradora");
                })
        }

    };



    //GRID
 
 
  
  
        const [columns] = useState([
        { name: 'SGRA_CNPJ', title: `CNPJ` },
        { name: 'SGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
        { name: 'SGRA_CIDADE', title: "CIDADE" },
        
      {
            name: "ALTERACAO", title: " ",
            getCellValue: row => (row.ID_SEGURADORA)

        }
        

    ]);

    const [editingStateColumns] = useState([
        { columnName: "ALTERACAO", editingEnabled: false },
        // {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
        // {columnName : "PRDT_VALOR",align: 'center'},

    ])

    const acessoSGRA =(valor)=>{ 
    if(acessoGeral || acessoCAD){
        return(    
            <div>  
         < AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastroSeguradora/0")} />       
        <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange" }} className="margemRight" onClick={(e) => navigate(`/cadastroSeguradora/${valor}`)} type="button" />
        <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red" }} onClick={(e) => deletarSeguradora(valor)} />
        </div> 
        )
    } else{
      return  <VisibilityIcon titleAccess="Visualizar" style={{ color: "green" }} className="margemRight" onClick={(e) => navigate(`/cadastroSeguradora/${valor}`)} type="button" />

    }
}
    const EditSeguradoras = ({ value }) => (
       acessoSGRA(value)    
    
    )
    const EditSeguradorasProv = props => (
        <DataTypeProvider
            formatterComponent={EditSeguradoras}
            {...props}
        />
    )
    



    return (
        <div className="container-fluid">

<h3 id='titulos'>Seguradoras 🚗 ​​</h3> 

            <div className="card">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >
                    <FilteringState defaultFilters={[]} />
                    <IntegratedFiltering />

                    <SortingState
                        columnExtensions={editingStateColumns}
                    />
                    <IntegratedSorting
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

                    <Table
                      //  tableComponent={TableComponent}
                    />
                    <TableHeaderRow
                        contentComponent={TableComponentTitle}
                        showSortingControls />
                    <TableEditRow />
                    <TableFilterRow />

                </Grid>
            </div>


        </div>

    )

}

export default ListarSeguradora;