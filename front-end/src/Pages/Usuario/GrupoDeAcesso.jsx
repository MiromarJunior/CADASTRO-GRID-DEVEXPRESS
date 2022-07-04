
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ListIcon from '@mui/icons-material/List';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import { AuthContext } from "../../Autenticação/validacao";
import Modal from '@mui/material/Modal';
import {  Paper, TextField } from "@mui/material";
import { deleteGrupoAcesso, getGrupoAcesso, saveGrupoAcesso } from "../../Service/usuarioService";
import ListarUsuario from "./ListarUsuario";
import { Grid, Table, TableColumnResizing, TableEditColumn, TableEditRow, TableFilterRow, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DataTypeProvider, EditingState, FilteringState, IntegratedFiltering, IntegratedSorting, SortingState } from "@devexpress/dx-react-grid";
import Acesso from "./Acesso";




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


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
  
  const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
      <IconButton size="large"
        color="primary"
        onClick={onExecute}
        title="Novo Contato"
      >
        <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
      </IconButton>
    </div>
  );
  
  
  const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Alterar Contato" size="large" >
      <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} />
    </IconButton>
  );
  
  const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Salvar alterações" size="large">
      <SaveIcon />
    </IconButton>
  );
  
  const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancelar alterações" size="large">
      <CancelIcon />
    </IconButton>
  );
  const commandComponents = {
  
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton,
  
  };
  
  const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
      <CommandButton
        onExecute={onExecute}
      />
    );
  };
  
  











const getRowId = row => row.id;
const GrupoDeAcesso = ()=>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [rowChanges, setRowChanges] = useState({});
    const [addedRows, setAddedRows] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [botaoAcessoColumn] = useState(["ALTERACAO"]);

    useEffect(() => {
       listaGrupoAcesso();
      }, []); 

    const cadastraGrupoAcesso = (lista) => {
        
        let dados = { lista, token };
      
    
        saveGrupoAcesso(dados)
          .then((res) => {
            if (res.data === "erroLogin") {
              window.alert("Sessão expirada, Favor efetuar um novo login !!");
              logout();
              window.location.reload();
            }
            else if (res.data === "semAcesso") {
              window.alert("Usuário sem permissão !!!");
    
            } else if (res.data === "sucesso") {
              window.alert("Grupo de Acesso cadastrado com sucesso !!");   
              listaGrupoAcesso();         
             
            } else if (res.data === "sucessoU") {
                window.alert("Grupo de Acesso atualizado com sucesso !!"); 
                listaGrupoAcesso();                
               
              } 
    
            else if (res.data === "duplicidade") {
              window.alert("Grupo já Cadastrado !\nFavor verificar!!");
    
            }
             else {
              window.alert(" erro ao tentar cadastrar Grupo de Acesso");
            }
    
          })
          .catch((err) => {
            console.error(err);
            window.alert("Erro ao cadastrar grupo de Acesso!!")
          })
      }
      const listaGrupoAcesso = async ()=>{
        let dados = { token };
        await getGrupoAcesso(dados)
          .then((res) => {
            if (res.data === "erroLogin") {
              window.alert("Sessão expirada, Favor efetuar um novo login !!");
              logout();
              window.location.reload();
            }
            else if (res.data === "semAcesso") {
              window.alert("Usuário sem permissão !!!");
    
            } else {
                (res.data).forEach((item, index) => (item.id = index));
              return setRows(res.data);
            }
    
    
          })
          .catch((err) => {
            console.error(err);
            window.alert("Erro ao listar grupo de acesso !!")
          })
    
      }

      const excluirGrupoAcesso = (idGa) => {
        
        let dados = { idGa, token };
      
    
        deleteGrupoAcesso(dados)
          .then((res) => {
            if (res.data === "erroLogin") {
              window.alert("Sessão expirada, Favor efetuar um novo login !!");
              logout();
              window.location.reload();
            }
            else if (res.data === "semAcesso") {
              window.alert("Usuário sem permissão !!!");
    
            } else if (res.data === "sucesso") {
             // window.alert("Grupo de Acesso cadastrado com sucesso !!");   
              listaGrupoAcesso();         
             
            }else if (res.data === "usuVinc") {
               window.alert("Não foi possivel excluir Grupo, pois existem usuário(s) vinculado(s) !!");   
               listaGrupoAcesso();         
              
             }
    
           
             else {
              window.alert(" erro ao tentar excluir Grupo de Acesso");
              listaGrupoAcesso();        
            }
    
          })
          .catch((err) => {
            console.error(err);
            window.alert("Erro ao cadastrar grupo de Acesso!!")
          })
      }


const [columns] = useState([
  
    { name: 'GRAC_DESCRICAO', title: "Grupo de Acesso" },   
    { name: 'ALTERACAO', title: "PERMISSÕES",
    getCellValue: row => (row.GRAC_CODIGO ? [row.GRAC_CODIGO,row.GRAC_DESCRICAO] : undefined),
}   

  ])


  const [defaultColumnWidths] = useState([
    { columnName: 'GRAC_DESCRICAO', width: 220 },
    { columnName: 'ALTERACAO', width: 220  },
])


  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      GRAC_CODIGO: null,
      GRAC_DESCRICAO: "",
      STATUS: "",
     

    })),
  );

  const commitChanges = ({ added, changed, deleted }) => {

    let changedRows;
    if (added) {

      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];


      for (let i = 0; i < changedRows.length; i++) {
        if (!(changedRows[i].GRAC_CODIGO)) {

          if (changedRows[i].GRAC_DESCRICAO === "" || changedRows[i].GRAC_DESCRICAO.length > 60) {
            window.alert("Tamanho do campo inválido");
        
          } else {
            cadastraGrupoAcesso(changedRows[i])
          }

        }
      }

    }

    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {

            if (changedRows[i].GRAC_DESCRICAO === "" || changedRows[i].GRAC_DESCRICAO.length > 60) {
                window.alert("Tamanho do campo inválido");
            
              } else {
                cadastraGrupoAcesso(changedRows[i])
              }
        }
    }
      


    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
       let changedRowsDel = rows.filter(row => deletedSet.has(row.id));
       let idGa = parseInt(changedRowsDel.map(l => l.GRAC_CODIGO));
       excluirGrupoAcesso(idGa);
       setRows(changedRows);
    }
    setRows(changedRows);
  
  }
  const [filteringStateColumnExtensions] = useState([
     { columnName: 'ALTERACAO', filteringEnabled: false,editingEnabled : false },
    ]);


  


    const BotaoAcesso = ({ value }) => (
        <div>
              <button className="btn btn-outline-primary" onClick={(e)=>navigate( `/acessoUsuario/${value[0]}/${value[1]}`)}>ACESSOS SISTEMA</button>
             

        </div>
      
           
          )
          const BotaoAcessoProv = (props) => (
            <DataTypeProvider
              formatterComponent={BotaoAcesso}
              {...props}
          
            />
          )

    return(
        <div className="container-fluid">
            <h3 id="titulos"> Grupos de Acesso</h3>   
           
            <div className="card ">
            <Paper>
                <Grid
                 rows={rows}
                 columns={columns}
                 getRowId={getRowId}
                >
                    <BotaoAcessoProv
                        for={botaoAcessoColumn}
                    />




                     <EditingState
             columnExtensions={filteringStateColumnExtensions}
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={getEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={setRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={changeAddedRows}
              onCommitChanges={commitChanges}
            // defaultEditingRowIds={}
            />
            <SortingState />
            <FilteringState 
            columnExtensions={filteringStateColumnExtensions}
            defaultFilters={[]} />
            <IntegratedFiltering />
            <IntegratedSorting />
                    <Table />
                    <TableEditRow />
                    <TableEditColumn
                    showEditCommand
                    showDeleteCommand
                    //showAddCommand
                    showAddCommand={!addedRows.length}
                    commandComponent={Command}
            />
                    <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                    <TableHeaderRow   
                    showSortingControls         
                    contentComponent={TableComponentTitle}
                    />
                    <TableFilterRow />
                   
           

                </Grid>
            </Paper>
            
            </div>
        
          
         
            
            </div>
         
           


      
        
    )

}

export default GrupoDeAcesso;



/*

 <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        
        <Typography id="modal-modal-title" variant="h6" component="h2" >
            Novo Grupo de Acesso
          </Typography><br/>
          
    
										
			<TextField onChange={(e)=> setGrupoAcesso((e.target.value).toUpperCase())} id="outlined-basic" label="Nome Grupo Acesso" variant="outlined"  /><br/>
											

									
          
            <button className="btnL" style={{width : "33%", padding : "2%"}} onClick={cadastraGrupoAcesso} >SALVAR 💾</button>
       
               
        </Box>
        
      </Modal>

*/