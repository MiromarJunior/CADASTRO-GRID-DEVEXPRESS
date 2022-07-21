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
import { deleteReguladoraID, getReguladora } from "../../Service/reguladoraService";
import { cnpj } from "cpf-cnpj-validator";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";


    const getRowId = row => row.id;
    const ListarReguladora = () => {
        const [rows, setRows] = useState([]);
        const navigate = useNavigate();     
        const { logout, nomeUser } = useContext(AuthContext);
        const [validCNPJ] = useState(["RGRA_CNPJ"]);
        const [editRgra] = useState(["ALTERACAO"]); 
        let token = localStorage.getItem("token");  
        const [acessoGeral, setAcessoGeral] = useState(false);    
        const [acessoDEL, setAcessoDEL] = useState(false);
        const [defaultHiddenColumnNames] = useState(['nova']);   
        const [acessoADD, setAcessoADD] = useState(false);
        const [displayEDIT, setDisplayEDIT] = useState("none");
        const [displayDEL, setDisplayDEL] = useState("none");
        const listaRgra = "LIST_REGULADORA";
        const incluirRgra = "ADD_REGULADORA";  
        const excluirRgra = "DEL_REGULADORA";
        const editarRgra = "EDIT_REGULADORA";

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
                     listarReguladora();                       
                    }else if(listaRgra === ac) {
                        listarReguladora();
                     }else if(incluirRgra === ac) {
                        setAcessoADD(true);
                     }else if(editarRgra === ac) {
                        setDisplayEDIT("");                        
                     }else if(excluirRgra === ac) {
                        setDisplayDEL("");   
                        setAcessoDEL(true);                     
                     }
                  })                   
              })
              .catch((err) => {
                console.error(err);
                window.alert("Erro ao Listar Reguladora !!")
              })
          }
          acessoMenuUser();  
          // eslint-disable-next-line  
    }, [logout, token,nomeUser]);

    const listarReguladora = async () => {
        let dados = { token };
        await getReguladora(dados)
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

    const deletarReguladora = (idReguladora) => {
        if(acessoGeral || acessoDEL){        
        let dados = { idReguladora, token, acessoGeral, acessoDEL };
        if (window.confirm("deseja excluir o item ?")) {
            deleteReguladoraID(dados)
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
                        window.alert("Reguladora Excluída com Sucesso!!!");
                        listarReguladora();
                    }
                })
                .catch((res) => {
                    console.error(res);
                    window.alert("Erro ao tentar excluir Reguladora");
                })
        }
    }else{
        window.alert("Usuário sem permissão !!!");
    }
    };
    //GRID

  const BotaoAd =  < AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastroReguladora/0")} />         
   
  const columns  =
  (     acessoGeral || acessoADD ?
    
        [{ name: 'RGRA_CNPJ', title: `CNPJ` },
        { name: 'RGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
        { name: 'RGRA_NOME_FANTASIA', title: "FANTASIA" },        
        {name: "ALTERACAO", title: BotaoAd,
          getCellValue: row => (row.ID_REGULADORA)
        }]    
        :
        [{ name: 'RGRA_CNPJ', title: `CNPJ` },
        { name: 'RGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
        { name: 'RGRA_NOME_FANTASIA', title: "FANTASIA" },        
        {name: "ALTERACAO", title: "Cadastro",
          getCellValue: row => (row.ID_REGULADORA)
        }]   
  )

    const [editingStateColumns] = useState([
        { columnName: "ALTERACAO", editingEnabled: false , title :"olamn"}
    ])

   
    const EditReguladoraAdm = ({ value }) => (
        <div>  
            <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange", display : displayEDIT }} className="margemRight" onClick={(e) => navigate(`/cadastroReguladora/${value}`)} type="button" />
            <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red" ,display : displayDEL}}   className="margemRight" onClick={(e) => deletarReguladora(value)} />
            <VisibilityIcon style={{ color: "green" ,display : (displayEDIT ==="none" ? "" : "none")}} titleAccess="Visualizar" className="margemRight" onClick={(e) => navigate(`/cadastroReguladora/${value}`)} type="button" />   
        </div>  
    )

    const EditReguladoraProv = props => (
        <DataTypeProvider
            formatterComponent={ EditReguladoraAdm}
            {...props}
        />
    )

    return (
        <div className="container-fluid">

<h3 id='titulos'>Reguladora 🚗 ​​</h3> 

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
                    <EditReguladoraProv for={editRgra} />
                    <ValidCnpjProv for={validCNPJ} />

                    <Table                     
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

export default ListarReguladora;