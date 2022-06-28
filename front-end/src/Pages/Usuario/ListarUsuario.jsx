/**
 * Lista de Usuários cadastrados no sistema,
 * Podemos cadastrar ou atualizar os usuárioso
 */

 import Paper from '@mui/material/Paper';
 import Chip from '@mui/material/Chip';
 import Input from '@mui/material/Input';
 import Select from '@mui/material/Select';
 import MenuItem from '@mui/material/MenuItem';

 import {
   DataTypeProvider,
   EditingState,
 } from '@devexpress/dx-react-grid';


import {  Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,} from "@devexpress/dx-react-grid-material-ui";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { deleteUsuario, getUsuarios, saveUsuario } from "../../Service/usuarioService";

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
 import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
 import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
 import IconButton from '@mui/material/IconButton';
 import SaveIcon from '@mui/icons-material/Save';
 import CancelIcon from '@mui/icons-material/Cancel';

const CategoriaFormatter = ({ value }) => <Chip label={ value } />;

const CategoriaEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value}
    onChange={event => onValueChange(event.target.value)}
    style={{ width: '100%' }}
  >
    <MenuItem value="Gestor">
    Gestor
    </MenuItem>
    <MenuItem value="Oficina">
    Oficina
    </MenuItem>
    <MenuItem value="Vendedor">
    Vendedor
    </MenuItem>
    <MenuItem value="Regulador">
    Regulador
    </MenuItem>
  </Select>
);

const CategoriaProvider = props => (
    <DataTypeProvider
      formatterComponent={CategoriaFormatter}
      editorComponent={CategoriaEditor}
      {...props}
    />
  );

  
  const SenhaFormatter = ({ value }) => <Chip label={ "****" } />;

  const SenhaEditor = ({ value, onValueChange }) => (
    <Input
      input={<Input  />}
      value={value}
      type={"password"}
      onChange={event => onValueChange(event.target.value)}
    
    >
    
    </Input>
  );
  
  const SenhaProvider = props => (
      <DataTypeProvider
        formatterComponent={SenhaFormatter}
        editorComponent={SenhaEditor}
        {...props}
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
      <DeleteForeverOutlinedIcon style={{color : "red"}} />
    </IconButton>
  );

  const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center'  }}>
      <IconButton size="large"
        color="primary"
        onClick={onExecute}
        title="Novo Contato"
      >
        <AddCircleOutlinedIcon style={{color : "blue"}} fontSize="large"/>
      </IconButton>
    </div>
  );


 const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Alterar Contato" size="large" >
      <ModeEditOutlineOutlinedIcon style={{ color: "orange" }}  />
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
  

const ListarUsuario =()=>{


    const { logout } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const [rows, setRows] = useState([]);
    const [booleanColumns] = useState(['USRO_CATEGORIA']);
    const [SenhaColumns] = useState(['SENHA']);

    
       
    const cadastraUsuario =(lista)=>{     
        let dados = {lista};
     
        saveUsuario(dados)
        .then((res)=>{
            if (res.data === "erroLogin") {
                window.alert("Sessão expirada, Favor efetuar um novo login !!");
                logout();
                window.location.reload();
            }
            else if (res.data === "semAcesso") {
                window.alert("Usuário sem permissão !!!");

            }else if(res.data ==="sucesso"){
                window.alert("Usuário cadastrado com sucesso !!");
                listaUsuarios();
                
            }else if(res.data ==="duplicidade"){
                window.alert("Usuário ou CPF já cadastrados !\nFavor verificar!!");
                
            }else{ 
                window.alert(" erro ao tentar cadastrar usuário");
            }





            
        })
        .catch((err)=>{
            console.error(err);
            window.alert("Erro ao cadastrar !!")
        })
    }

    const deletarUsuario = (idUsu)=>{
    
        let dados = {token, idUsu : parseInt(idUsu)};
        deleteUsuario(dados)
        .then((res)=>{
            if (res.data === "erroLogin") {
                window.alert("Sessão expirada, Favor efetuar um novo login !!");
                logout();
                window.location.reload();
            }
            else if (res.data === "semAcesso") {
                window.alert("Usuário sem permissão !!!");

            }else if(res.data ==="sucesso"){
                window.alert("Usuário excluído com sucesso !!");
                listaUsuarios();
            }else{ 
                window.alert(" erro ao tentar excluír usuário");
            }            
        })
        .catch((err)=>{
            console.error(err);
            window.alert("Erro ao cadastrar !!")
        })
    }

    useEffect(() => {   
        
       
        listaUsuarios();

    }, []);

    //GRID


    const listaUsuarios = async()=>{           
      let dados = {token};
    await  getUsuarios(dados)
      .then((res)=>{
        
          if (res.data === "erroLogin") {
              window.alert("Sessão expirada, Favor efetuar um novo login !!");
              logout();
              window.location.reload();
          }
          else if (res.data === "semAcesso") {
              window.alert("Usuário sem permissão !!!");

          } else{
              (res.data).forEach((item, index) => (item.id = index));                 
              return  setRows(res.data);
          }

          
      })
      .catch((err)=>{
          console.error(err);
          window.alert("Erro ao cadastrar !!")
      })
  }
      
   

    const [columns] = useState([
        { name: 'USRO_USUARIO', title: `USUARIO`},
        { name: 'USRO_NOME', title: "NOME"},
         { name: 'SENHA', title: "SENHA" },
         { name: 'USRO_CATEGORIA', title: "CATEGORIA" },
         { name: 'USRO_CNPJ_FORNECEDOR', title: "CNPJ FORNECEDOR" },
         { name: 'USRO_CPF', title: "CPF" },
       

    ])

    const [rowChanges, setRowChanges] = useState({});
    const [addedRows, setAddedRows] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
  
    const changeAddedRows = value => setAddedRows(
        value.map(row => (Object.keys(row).length ? row : {
            ID_USUARIO : null,
            USRO_USUARIO: "",
            USRO_NOME: "",
            SENHA: "",
            USRO_CATEGORIA: "",
            USRO_CNPJ_FORNECEDOR: "",
            USRO_CPF: "",
                     
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

          
          for(let i = 0; i < changedRows.length; i++){
            if(!(changedRows[i].ID_USUARIO)){
              
      
              if(changedRows[i].USRO_USUARIO === ""){
                window.alert("Favor Preencher campo Usuário");
              }else if(changedRows[i].USRO_NOME === ""){
                window.alert("Favor Preencher campo Nome");
              }              
              else if(changedRows[i].SENHA === ""){
                window.alert("Favor Preencher campo Senha");
              }else if(changedRows[i].USRO_CATEGORIA === ""){
                window.alert("Favor Preencher campo Categoria");
              }else if(changedRows[i].USRO_CNPJ_FORNECEDOR === ""){
                window.alert("Favor Preencher campo CNPJ Fornecedor");
              }else if(changedRows[i].USRO_CPF === ""){
                window.alert("Favor Preencher campo CPF");
              }else{
                cadastraUsuario(changedRows[i])
              }
      

     
            //cadastraUsuario(changedRows[i]);
            }
          }




          //setRows(changedRows);
     
        }
        if (changed) {              
         changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));         
          for(let i = 0; i < rows.length; i++){
            if(JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])){
           
              if(changedRows[i].USRO_USUARIO === ""){
                window.alert("Favor Preencher campo Usuário");
              }else if(changedRows[i].USRO_NOME === ""){
                window.alert("Favor Preencher campo Nome");
              }              
              else if(changedRows[i].SENHA === ""){
                window.alert("Favor Preencher campo Senha");
              }else if(changedRows[i].USRO_CATEGORIA === ""){
                window.alert("Favor Preencher campo Categoria");
              }else if(changedRows[i].USRO_CNPJ_FORNECEDOR === ""){
                window.alert("Favor Preencher campo CNPJ Fornecedor");
              }else if(changedRows[i].USRO_CPF === ""){
                window.alert("Favor Preencher campo CPF");
              }else{
                cadastraUsuario(changedRows[i])
              }
            }
          }
       
       
        }
        if (deleted) {
         
          const deletedSet = new Set(deleted);
          changedRows = rows.filter(row => deletedSet.has(row.id));         
             deletarUsuario(changedRows.map(l => l.ID_USUARIO));
            // setRows(changedRows);
        }
        setRows(changedRows);
      };



    return(
        <div>
          <h3>Em Desenvolvimento</h3>

<div className="card">
    <Paper>
      <Grid
           rows={rows}
           columns={columns}
      
         >
           <CategoriaProvider
             for={booleanColumns}
           />
           <SenhaProvider
           for={SenhaColumns}
           />
          
           <EditingState
           editingRowIds={editingRowIds}
           onEditingRowIdsChange={getEditingRowIds}
           rowChanges={rowChanges}
           onRowChangesChange={setRowChanges}
           addedRows={addedRows}
           onAddedRowsChange={changeAddedRows}
           onCommitChanges={commitChanges}
            // defaultEditingRowIds={}
           />
           <Table />
           <TableHeaderRow />
           <TableEditRow />
           <TableEditColumn           
             showEditCommand
             showDeleteCommand
             showAddCommand={!addedRows.length}
             commandComponent={Command}  
           />
        
        
        
           
        
      </Grid>
      </Paper>
    </div>
           
        </div>
    )

}

export default ListarUsuario;