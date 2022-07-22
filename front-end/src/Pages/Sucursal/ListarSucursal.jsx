import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState, SortingState,IntegratedSorting,IntegratedFiltering,FilteringState,} from '@devexpress/dx-react-grid';
import { Grid,Table,TableHeaderRow,TableEditRow,TableFilterRow,TableColumnVisibility,} from '@devexpress/dx-react-grid-material-ui';
import { deleteSucursalID,getSucursal} from "../../Service/sucursalService";
import { cnpj } from "cpf-cnpj-validator";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";


    const getRowId = row => row.id;
    const ListarSucursal = () => {
        const [rows, setRows] = useState([]);
        const navigate = useNavigate();     
        const { logout, nomeUser } = useContext(AuthContext);
        let token = localStorage.getItem("token");  
        const [validCNPJ] = useState(["SUAL_CNPJ"]);
        const [editSual] = useState(["ALTERACAO"]); 
        const [acessoGeral, setAcessoGeral] = useState(false);    
        const [acessoDEL, setAcessoDEL] = useState(false);
        const [defaultHiddenColumnNames] = useState(['nova']);   
        const [acessoADD, setAcessoADD] = useState(false);
        const [displayEDIT, setDisplayEDIT] = useState("none");
        const [displayDEL, setDisplayDEL] = useState("none"); 
        const listaSual = "LIST_SUCURSAL";
        const incluirSual = "ADD_SUCURSAL";  
        const excluirSual = "DEL_SUCURSAL";
        const editarSual = "EDIT_SUCURSAL";

    useEffect(() => {     
        const acessoMenuUser = async ()=>{          
            let dados = { token, usuario : nomeUser() };
            await getAcessoUserMenu(dados)
              .then((res) => {                 
                  (res.data).forEach((ac)=>{                
                    if(process.env.REACT_APP_API_ACESSO_GERAL === ac ){                    
                     setDisplayEDIT("");  
                     setDisplayDEL("");   
                     setAcessoGeral(true);                    
                     listarSucursal();                       
                    }else if(listaSual === ac) {
                        listarSucursal();
                     }else if(incluirSual === ac) {
                        setAcessoADD(true);
                     }else if(editarSual === ac) {
                        setDisplayEDIT("");                        
                     }else if(excluirSual === ac) {
                        setDisplayDEL("");   
                        setAcessoDEL(true);                     
                     }
                  })                   
              })
              .catch((err) => {
                console.error(err);
                window.alert("Erro ao Listar Sucursal !!")
              })
          }
          acessoMenuUser();  
          // eslint-disable-next-line  
    }, [logout, token,nomeUser]);

    const listarSucursal = async () => {
        let dados = { token };
        await getSucursal(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                }
                else if (res.data === "semAcesso") {
                    alert("Usuário sem permissão !!!");
                    navigate("/home");

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

    const deletarSucursal = (idSucursal) => {
        if(acessoGeral || acessoDEL){        
        let dados = { idSucursal, token, acessoGeral, acessoDEL };
        if (window.confirm("deseja excluir o item ?")) {
            deleteSucursalID(dados)
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
                        window.alert("Sucursal Excluída com Sucesso!!!");
                        listarSucursal();
                    }
                })
                .catch((res) => {
                    console.error(res);
                    window.alert("Erro ao tentar excluir Sucursal");
                })
        }
    }else{
        window.alert("Usuário sem permissão !!!");
    }
    };
    //GRID

    const BotaoAd =  < AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastroSucursal/0")} />         
   
  const columns  =
  (     acessoGeral || acessoADD ?
    
        [{ name: 'SUAL_CNPJ', title: `CNPJ` },
         { name: 'SUAL_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
         { name: 'SUAL_NOME_FANTASIA', title: "FANTASIA" },        
         {name: "ALTERACAO", title: BotaoAd,
          getCellValue: row => (row.ID_SUCURSAL)
        }]    
        :
        [{ name: 'SUAL_CNPJ', title: `CNPJ` },
         { name: 'SUAL_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
         { name: 'SUAL_NOME_FANTASIA', title: "FANTASIA" },        
         {name: "ALTERACAO", title: "Cadastro",
          getCellValue: row => (row.ID_SUCURSAL)
        }]   
  )

    const [editingStateColumns] = useState([
        { columnName: "ALTERACAO", editingEnabled: false , title :"olamn"}
    ])

   
    const EditSucursalAdm = ({ value }) => (
        <div>  
            <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange", display : displayEDIT }} className="margemRight" onClick={(e) => navigate(`/cadastroSucursal/${value}`)} type="button" />
            <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red" ,display : displayDEL}}   className="margemRight" onClick={(e) => deletarSucursal(value)} />
            <VisibilityIcon style={{ color: "green" ,display : (displayEDIT ==="none" ? "" : "none")}} titleAccess="Visualizar" className="margemRight" onClick={(e) => navigate(`/cadastroSucursal/${value}`)} type="button" />   
        </div>  
    )

    const EditSucursalProv = props => (
        <DataTypeProvider
            formatterComponent={ EditSucursalAdm}
            {...props}
        />
    )

    return (
        <div className="container-fluid">

<h3 id='titulos'>Sucursal 🚗 ​​</h3> 

            <div className="card">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >
                    <FilteringState defaultFilters={[]} />
                    <IntegratedFiltering />

                    <SortingState columnExtensions={editingStateColumns} />
                    <IntegratedSorting />
                    <EditingState columnExtensions={editingStateColumns} />
                    <EditSucursalProv for={editSual} />
                    <ValidCnpjProv for={validCNPJ} />

                    <Table
                      //  tableComponent={TableComponent}
                    />
                    {!acessoGeral ? <TableColumnVisibility  defaultHiddenColumnNames={defaultHiddenColumnNames}  /> : ""  }
                    
                    <TableHeaderRow contentComponent={TableComponentTitle} showSortingControls />
                    <TableEditRow />
                    <TableFilterRow />
                </Grid>
            </div>
        </div>
    )
}
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

export default ListarSucursal;