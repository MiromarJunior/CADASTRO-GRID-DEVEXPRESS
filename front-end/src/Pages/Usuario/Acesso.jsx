
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



import { AuthContext } from "../../Autenticação/validacao";

import {  Paper } from "@mui/material";
import { getAcesso, getAcessoUserMenu,saveAcesso } from "../../Service/usuarioService";

import { Grid, Table, TableColumnResizing, TableFilterRow, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";

import { DataTypeProvider, EditingState, FilteringState, IntegratedFiltering,  IntegratedSorting,  SortingState } from "@devexpress/dx-react-grid";






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
    const [botaoStatus] = useState(["ALTERACAO"]);
    const [acessoGeral, setAcessoGeral] = useState(false);
    const [displayAcesso, setDisplayAcesso] = useState("none")
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
              (res.data).forEach((l)=>{
            
                if(process.env.REACT_APP_API_ACESSO_GERAL === l.ACES_DESCRICAO){
                  setAcessoGeral(true);
                  setDisplayAcesso("");
                  listaAcesso();
                  

                }               


              })
              
            }
    
    
          })
          .catch((err) => {
            console.error(err);
            window.alert("Erro ao buscar Usuário !!")
          })
    
      }


      acessoMenuUser();

     
   
      }, [logout,token,nomeUser]); 

    const cadastrarAcesso = (idGa,idAc) => {
        
        let dados = { idGa,idAc, token,acessoGeral };
        if(acessoGeral){
    
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
        }else{
          window.alert("Usuário sem permissão !!!");
          navigate("/home");
        
        }
      }
      const listaAcesso = async ()=>{
         let dados = { token,idGa, acessoGeral };    
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
      

   




const alteraAcesso =(valor)=>{
  if(valor === "ACESSO_MASTER"){
    return "ACESSO GERAL"
  }else if(valor === "CADASTRO_SGRA"){
    return "CADASTRO SEGURADORAS"
  }else if(valor === "CADASTRO_USRO"){
    return "CADASTRO USUÁRIOS"
  }else if(valor === "ACESSO_CAD_GERAL"){
    return "CADASTROS GERAIS"
  }   
  else{return valor}

} 
const [columns] = useState([
  
    { name: 'ACES_DESCRICAO', title: "ACESSO" ,
    getCellValue: row => (alteraAcesso(row.ACES_DESCRICAO)),
  
  
  },   
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
  
 

  
   

          const BotaoStatus = ({ value }) => (
     
     <button  onClick={(e)=> cadastrarAcesso(idGa,value[1])}  className={value[0] === 1 ? "btn btn-outline-danger btnAcessoGr" : "btn btn-outline-primary btnAcessoGr"} >{  value[0] === 1 ? "DESATIVAR" : "ATIVAR"}</button>
            
                 
                )
                const BotaoStatusProv = (props) => (
                  <DataTypeProvider
                    formatterComponent={BotaoStatus}
                    {...props}
                
                  />
                )














    return(
   
        <div className="container-fluid " style={{display :  displayAcesso}} >
            <h3 id="titulos"> Controle de Acessos grupo {grAce}</h3>   
           <button style={{marginBottom : "5px"}} className="btn btn-outline-primary btnAcessoGr" onClick={(e)=> navigate("/gruposDeAcesso")} >VOLTAR</button>
            <div className="card  "    >
            <Paper>
                <Grid
                 rows={rows}
                 columns={columns}
                 getRowId={getRowId}
                >
                    
                    <BotaoStatusProv
                      for={botaoStatus}
                    />






                     <EditingState
             columnExtensions={filteringStateColumnExtensions}
              
            // defaultEditingRowIds={}
            />
            <SortingState
              defaultSorting={[{ columnName: 'ACES_DESCRICAO', direction: 'asc' }]}   
             />
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