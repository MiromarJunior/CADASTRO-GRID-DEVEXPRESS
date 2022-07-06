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
    TableEditColumn,

} from '@devexpress/dx-react-grid-material-ui';
import { deleteSeguradoraID, getSeguradora } from "../../Service/seguradoraService";
import { cnpj } from "cpf-cnpj-validator";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { display } from "@mui/system";
import { IconButton } from "@mui/material";


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

const DeleteButton = ({ onExecute }) => (
    <IconButton
        onClick={() => {
            // eslint-disable-next-line
            if (window.confirm('Deseja excluir esse contato ?')) {
                onExecute();
            }
        }}
        title="Excluir contato"
        size="large"
    >
        <DeleteForeverOutlinedIcon style={{ color: "red" }} />
    </IconButton>
);





const getRowId = row => row.id;
const ListarSeguradora = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [validCNPJ] = useState(["SGRA_CNPJ"]);
    const [editSeg] = useState(["ALTERACAO"]);
    const [acessoGeral, setAcessoGeral] = useState(false);
    const [acessoCAD, setAcessoCAD] = useState(false);

    const [displayAcesso, setDisplayAcesso] = useState("none");


    useEffect(() => {
      
            const acessoMenuUser = async ()=>{
              let dados = { token, usuario :nomeUser() };
              await getAcessoUserMenu(dados)
                .then((res) => {
                  if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                  }
                  else if (res.data === "semAcesso") {
                    window.alert("Usuário sem permissão !!!");
          
                  } else {
                    (res.data).map((l)=>{
                  
                      if(process.env.REACT_APP_API_ACESSO_GERAL || process.env.REACT_APP_API_ACESSO_CAD === l.ACES_DESCRICAO){
                        setAcessoGeral(true);
                        setAcessoCAD(true);
                        setDisplayAcesso("");
                        
                  
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
      
           
        

        listarSeguradoras();
    }, [logout, token]);

    const listarSeguradoras = async () => {
        let dados = { token };
        await getSeguradora(dados)
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

    const deletarSeguradora = (idSeg) => {
        let dados = { idSeg, token };
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
                        listarSeguradoras();
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
    const [editingRowIds, setEditingRowIds] = useState([]);

    const commitChanges = ({ added, changed, deleted}) => {
       
        
        let changedRows;
        if (added) {
            alert("editar")
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            changedRows = [
                ...rows,
                ...added.map((row, index) => ({
                    id: startingAddedId + index,
                    ...row,
                })),
            ];
        }
        
        if (changed) {
            const ll = Object.keys(changed);
            console.log(rows.id[ll]);
          
            const changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
       //     console.log(rows.map(row => row.id));
           


        }
        if (deleted) {
          

            const deletedSet = new Set(deleted);
            changedRows = rows.filter(row => !deletedSet.has(row.id));
            let changedRowsDel = rows.filter(row => deletedSet.has(row.id));
            let idCont = parseInt(changedRowsDel.map(l => l.ID_SEGURADORA_CONTATO));
            alert("excluir");
            //deletarContato(idCont);
            // deletarContato( changedRowsDel.map(l => l.ID_SEGURADORA_CONTATO));

        }
        setRows(changedRows);
    };
    const AddButton = () => (
        <div style={{ textAlign: 'center' }}>
            <IconButton size="large"
                color="primary"
                onClick={() => navigate("/cadastroSeguradora/0")}
                title="Novo Contato"
            >
                <AddCircleOutlinedIcon  style={{ color: "blue" }} fontSize="large"  />
            </IconButton>
        </div>
    );
    
    
    const EditButton = ({ onExecute }) => (
        
        <IconButton title="Alterar Contato" size="large" onClick={onExecute} >
            <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} />
        </IconButton>
    );
    const CommitButton = ({ onExecute }) => (
        <IconButton onClick={onExecute} title="Salvar alterações" size="large">
             <button>save</button>
        </IconButton>
    );
    const CancelButton = ({ onExecute }) => (
        <IconButton color="secondary" onClick={onExecute} title="Cancelar alterações" size="large">
            <button>cancel</button>
      
        </IconButton>
    );
    
    const commandComponents = {
    
        add: AddButton,       
        delete: DeleteButton,
        edit : EditButton,
        commit: EditButton,
        cancel: EditButton,
        
        
        
    
    };
    
    
    const Command = ({ id, onExecute }) => {
        
        const CommandButton = commandComponents[id];
        return (
            <CommandButton
                onExecute={onExecute}
            />
        );
    };
    
    






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
        <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange" }} className="margemRight" onClick={(e) => navigate(`/cadastroSeguradora/${valor}`)} type="button" />,
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
                       
                        onCommitChanges={commitChanges}
                        defaultEditingRowIds={[0]}
                  
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
                    {acessoGeral || acessoCAD ? <TableEditColumn
                                showEditCommand
                                showAddCommand
                                showDeleteCommand
                                commandComponent={Command}
                            /> : ""}
                    <TableFilterRow />

                </Grid>
            </div>


        </div>

    )

}

export default ListarSeguradora;