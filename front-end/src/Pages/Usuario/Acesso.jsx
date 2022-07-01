
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



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
import { deleteGrupoAcesso, getAcesso, getAcessoUserMenu, getAcessoUsu, getGrupoAcesso, saveAcesso, saveGrupoAcesso } from "../../Service/usuarioService";
import ListarUsuario from "./ListarUsuario";
import { Grid, Table, TableColumnResizing, TableEditColumn, TableEditRow, TableFilterRow, TableHeaderRow, TableSelection } from "@devexpress/dx-react-grid-material-ui";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DataTypeProvider, EditingState, FilteringState, IntegratedFiltering, IntegratedSelection, IntegratedSorting, SelectionState, SortingState } from "@devexpress/dx-react-grid";




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



 











const getRowId = row => row.id;
const Acesso = ()=>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [acessTitle] = useState(["ACES_DESCRICAO"]);
    const [botaoStatus] = useState(["ALTERACAO"]);
    const [acessoUsu, setAcessoUsu] = useState([]);
    const {idGa,grAce} = useParams();


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
            
                if(process.env.REACT_APP_API_ACESSO_GERAL === l.ACES_DESCRICAO){
                  console.log("Acgou");
                }
                if(process.env.REACT_APP_API_CAD_SGRA === l.ACES_DESCRICAO){
                  console.log("Acgou 0000");
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

        listaAcesso();
   
      }, [logout,token]); 

    const cadastrarAcesso = (idGa,idAc) => {
        
        let dados = { idGa,idAc, token };
      
    
        saveAcesso(dados)
          .then((res) => {
            if (res.data === "erroLogin") {
              window.alert("Sessão expirada, Favor efetuar um novo login !!");
              logout();
              window.location.reload();
            }
            else if (res.data === "semAcesso") {
              window.alert("Usuário sem permissão !!!");
    
            } else if (res.data === "sucesso") {
              window.alert("Acesso cadastrado com sucesso !!");   
              listaAcesso();         
             
            } 
            else if (res.data === "sucessoD") {
              window.alert("Acesso excluído com sucesso !!");   
              listaAcesso();         
             
            } 
    
            
             else {
              window.alert(" erro ao tentar cadastrar Acesso");
            }
    
          })
          .catch((err) => {
            console.error(err);
            window.alert("Erro ao cadastrar grupo de Acesso!!")
          })
      }
      const listaAcesso = async ()=>{
        let dados = { token,idGa };
        await getAcesso(dados)
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
            window.alert("Erro ao cadastrar !!")
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
              listaAcesso();         
             
            }
    
           
             else {
              window.alert(" erro ao tentar excluir Grupo de Acesso");
            }
    
          })
          .catch((err) => {
            console.error(err);
            window.alert("Erro ao cadastrar grupo de Acesso!!")
          })
      }


const [columns] = useState([
  
    { name: 'ACES_DESCRICAO', title: "ACESSO" },   
    { name: 'ALTERACAO', title: "STATUS",
    getCellValue: row => ([row.TOTAL, row.ACES_CODIGO]),
  },   

  ])

  const [defaultColumnWidths] = useState([
    { columnName: 'ACES_DESCRICAO', width: 400 },
    { columnName: 'ALTERACAO', width: 200 ,
  },
   
 
  ]);

 


  const [filteringStateColumnExtensions] = useState([
     { columnName: 'ALTERACAO', filteringEnabled: false,editingEnabled : false },
    ]);
  

   

    const alteraAcesso =(valor)=>{
      if(valor === "ACESSO_MASTER"){
        return "ACESSO GERAL"
      }else if(valor === "CADASTRO_SGRA"){
        return "CADASTRO SEGURADORAS"
      }else if(valor === "CADASTRO_USRO"){
        return "CADASTRO USUÁRIOS"
      }      
      
      else{return ""}

    }
    const AcessTitle = ({ value }) => (
      alteraAcesso(value)
      
           
          )
          const AcessTitleProv = (props) => (
            <DataTypeProvider
              formatterComponent={AcessTitle}
              {...props}
          
            />
          )


          const BotaoStatus = ({ value }) => (
     
     <button style={{width : "120px"}} onClick={(e)=> cadastrarAcesso(idGa,value[1])}  className={value[0] === 1 ? "btn btn-outline-danger" : "btn btn-outline-primary"} >{  value[0] === 1 ? "DESATIVAR" : "ATIVAR"}</button>
            
                 
                )
                const BotaoStatusProv = (props) => (
                  <DataTypeProvider
                    formatterComponent={BotaoStatus}
                    {...props}
                
                  />
                )














    return(
        <div className="container-fluid "  >
            <h3 id="titulos"> Controle de Acessos grupo {grAce}</h3>   
           <button style={{marginBottom : "5px"}} className="btn btn-outline-primary" onClick={(e)=> navigate("/gruposDeAcesso")} >VOLTAR</button>
            <div className="card  "    >
            <Paper>
                <Grid
                 rows={rows}
                 columns={columns}
                 getRowId={getRowId}
                >
                    <AcessTitleProv
                        for={acessTitle}
                    />
                    <BotaoStatusProv
                      for={botaoStatus}
                    />






                     <EditingState
             columnExtensions={filteringStateColumnExtensions}
              
            // defaultEditingRowIds={}
            />
            <SortingState />
            <FilteringState 
            columnExtensions={filteringStateColumnExtensions}
            defaultFilters={[]} />
         
            
            <IntegratedFiltering />
            <IntegratedSorting />
                    <Table />
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

export default Acesso;



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