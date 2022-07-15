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
    TableColumnVisibility,

} from '@devexpress/dx-react-grid-material-ui';
import { deleteFornecedorID, getFornecedor } from "../../Service/fornecedorService";
import { cnpj } from "cpf-cnpj-validator";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";




    const getRowId = row => row.id;
    const ListarFornecedor = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();     
    const { logout, nomeUser } = useContext(AuthContext);
    const [validCNPJ] = useState(["FORN_CNPJ"]);
    const [editForn] = useState(["ALTERACAO"]); 
    let token = localStorage.getItem("token");  
    const [acessoGeral, setAcessoGeral] = useState(false);    
    const [acessoDEL, setAcessoDEL] = useState(false);
     const [defaultHiddenColumnNames] = useState(['nova']);   
    const [acessoADD, setAcessoADD] = useState(false);
    const [displayEDIT, setDisplayEDIT] = useState("none");
    const [displayDEL, setDisplayDEL] = useState("none");
    const listaForn = "LIST_FORN";
    const incluirForn = "ADD_FORN";  
    const excluirForn = "DEL_FORN";
    const editarForn = "EDIT_FORN";

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
                     listarFornecedores();                       
                    }else if(listaForn === ac) {
                        listarFornecedores();
                     }else if(incluirForn === ac) {
                        setAcessoADD(true);
                     }else if(editarForn === ac) {
                        setDisplayEDIT("");                        
                     }else if(excluirForn === ac) {
                        setDisplayDEL("");   
                        setAcessoDEL(true);                     
                     }
                  })                   
              })
              .catch((err) => {
                console.error(err);
                window.alert("Erro ao Listar Fornecedores !!")
              })
          }
          acessoMenuUser();    
    }, [logout, token]);

    const listarFornecedores = async () => {
        let dados = { token };
        await getFornecedor(dados)
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

    const deletarFornecedor = (idFornecedor) => {
        if(acessoGeral || acessoDEL){        
        let dados = { idFornecedor, token, acessoGeral, acessoDEL };
        if (window.confirm("deseja excluir o item ?")) {
            deleteFornecedorID(dados)
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
                        window.alert("Fornecedor Excluída com Sucesso!!!");
                        listarFornecedores();
                    }
                })
                .catch((res) => {
                    console.error(res);
                    window.alert("Erro ao tentar excluir Fornecedor");
                })
        }
    }else{
        window.alert("Usuário sem permissão !!!");
    }
    };
    //GRID

    const BotaoAd =  < AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastroFornecedor/0")} />         
   
  const columns  =
  (     acessoGeral || acessoADD ?
    
        [{ name: 'FORN_CNPJ', title: `CNPJ` },
        { name: 'FORN_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
        { name: 'FORN_CIDADE', title: "CIDADE" },        
        {name: "ALTERACAO", title: BotaoAd,
          getCellValue: row => (row.ID_FORNECEDOR)
        }]    
        :
        [{ name: 'FORN_CNPJ', title: `CNPJ` },
        { name: 'FORN_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
        { name: 'FORN_CIDADE', title: "CIDADE" },        
        {name: "ALTERACAO", title: "Cadastro",
          getCellValue: row => (row.ID_FORNECEDOR)
        }]   
  )

    const [editingStateColumns] = useState([
        { columnName: "ALTERACAO", editingEnabled: false , title :"olamn"},
        // {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
        // {columnName : "PRDT_VALOR",align: 'center'},
    ])

   
    const EditFornecedoresAdm = ({ value }) => (
        <div>  
            <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange", display : displayEDIT }} className="margemRight" onClick={(e) => navigate(`/cadastroFornecedor/${value}`)} type="button" />
            <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red" ,display : displayDEL}}   className="margemRight" onClick={(e) => deletarFornecedor(value)} />
            <VisibilityIcon style={{ color: "green" ,display : (displayEDIT ==="none" ? "" : "none")}} titleAccess="Visualizar" className="margemRight" onClick={(e) => navigate(`/cadastroFornecedor/${value}`)} type="button" />   
        </div>  
    )

    const EditFornecedoresProv = props => (
        <DataTypeProvider
            formatterComponent={ EditFornecedoresAdm}
            {...props}
        />
    )

    return (
        <div className="container-fluid">

<h3 id='titulos'>Fornecedores 🚗 ​​</h3> 

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
                    <EditFornecedoresProv for={editForn} />
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

export default ListarFornecedor;