/**
 * Lista de Usuários cadastrados no sistema,
 * Podemos cadastrar ou atualizar os usuárioso
 */

import Paper from '@mui/material/Paper';
//import Chip from '@mui/material/Chip';
//import Input from '@mui/material/Input';
//import Select from '@mui/material/Select';
//import MenuItem from '@mui/material/MenuItem';

import "./GrupoItem.css";

import {
  DataTypeProvider,
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedSorting,
  SortingState
} from '@devexpress/dx-react-grid';


import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableFilterRow,
  TableColumnResizing
} from "@devexpress/dx-react-grid-material-ui";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { deleteGrupoItem, getGrupoItem, saveGrupoItem } from "../../Service/grupoItemService";

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import Button from '@mui/material/Button';



const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Deseja excluir este Grupo Item ?')) {
        onExecute();
      }
    }}
    title="Excluir Grupo Item"
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
      title="Novo Grupo de Item"
    >
      <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
    </IconButton>
  </div>
);


const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Alterar Grupo" size="large" >
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

const ListarGrupoItem = () => {
  const { logout  } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [editSubGrupo] = useState(["SUBGRUPO"]); 
  
  useEffect(() => {
    listaGruposItem();
    // eslint-disable-next-line
  }, [logout, token]);

  const cadastraGrupoItem = (lista) => {
    let dados = { lista, token };

    saveGrupoItem(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          window.alert("Grupo Item cadastrado com sucesso !!");
          listaGruposItem();

        } else if (res.data === "duplicidade") {
          window.alert("Grupo de Item já cadastrado !\nFavor verificar!!");

        } else {
          window.alert(" erro ao tentar cadastrar usuário");
        }
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const deletarGrupoItem = (idGrupoItem) => {

    let dados = { token, idGrupoItem: parseInt(idGrupoItem) };
    deleteGrupoItem(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "ERROFK") {
          window.alert("Registros Filhos encontrados (SUBGRUPO)");
        }        
        else if (res.data === "sucesso") {
          
          window.alert("Grupo Item excluído com sucesso !!");          
          //listaGruposItem();
        } else {
          window.alert(" erro ao tentar excluír usuário");
        }
        listaGruposItem();
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao Excluir !!")
      })
  }

  const listaGruposItem = async () => {
    let dados = { token };
    await getGrupoItem(dados)
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

  /*   const [columns] = useState([
      { name: 'GRPO_DESCRICAO', title: `DESCRIÇÃO DO GRUPO ITEM`, required: true }
  ]) */

  const columns = [
    { name: 'GRPO_DESCRICAO', title: `DESCRIÇÃO DO GRUPO ITEM`, required: true },
    { name: "SUBGRUPO", title: " ", getCellValue: row => (row.ID_GRUPO_ITEM) }
  ]

  const [editingStateColumns] = useState([
    { columnName: "SUBGRUPO", editingEnabled: false },
  ])

  const [defaultColumnWidths] = useState([
    { columnName: 'GRPO_DESCRICAO', width: 450 },
    { columnName: "SUBGRUPO", width: 150}
  ]);
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);

  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      ID_GRUPO_ITEM: null,
      GRPO_DESCRICAO: ""
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
        if (!(changedRows[i].ID_GRUPO_ITEM)) {


          if (changedRows[i].GRPO_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição do Grupo");
          } else {
            cadastraGrupoItem(changedRows[i])
          }
          //cadastraUsuario(changedRows[i]);
        }
      }
      //setRows(changedRows);     
    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {

          if (changedRows[i].GRPO_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição do Grupo");
          } else {        
            cadastraGrupoItem(changedRows[i])
          }
        }
      }
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => deletedSet.has(row.id));
      deletarGrupoItem(changedRows.map(l => l.ID_GRUPO_ITEM));
      // setRows(changedRows);
    }
    setRows(changedRows);
  };  
    
  const acessoSGRA =(valor)=>{ 
      return  <Button variant="outlined" size='small' onClick={(e) => navigate(`/ListarSubGrupoItem/${valor}`)}>SubGrupo</Button>
    }


  const EditSubGrupo = ({ value }) => (
    acessoSGRA(value) 
 )
 const EditSubGrupoProv = props => (
     <DataTypeProvider
         formatterComponent={EditSubGrupo}
         {...props}
     />
 )

 
  return (
    <div className='container-fluid'>
      <h3 id='titulos'>Grupo do Item​</h3>
      <div className="container">
      
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
          >
            <SortingState 
               columnExtensions={editingStateColumns}
            />

            <FilteringState
              defaultFilters={[{ columnName: "GRPO_DESCRICAO", value: "" }]} />
            <IntegratedFiltering />
            <IntegratedSorting />
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={getEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={setRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={changeAddedRows}
              onCommitChanges={commitChanges}
              columnExtensions={editingStateColumns}
            // defaultEditingRowIds={}
            />
            <EditSubGrupoProv
               for={editSubGrupo}
            />
            <Table 
            />
            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
            <TableHeaderRow
              showSortingControls
              contentComponent={TableComponentTitle}
            />
            <TableEditRow />
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand={!addedRows.length}
              commandComponent={Command}
            />
            <TableFilterRow />
          </Grid>
        </Paper>
      
      </div>

    </div>

  )

}

export default ListarGrupoItem;