
import Paper from '@mui/material/Paper';
//import Chip from '@mui/material/Chip';
//import Input from '@mui/material/Input';
//import Select from '@mui/material/Select';
//import MenuItem from '@mui/material/MenuItem';


import {
  //DataTypeProvider,
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
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import React, { useContext, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { deleteCategMsgs, getCategMsgs, saveCategMsgs } from "../../Service/categoriaMensagens"

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Deseja excluir esta Categoria de Mensagens ?')) {
        onExecute();
      }
    }}
    title="Excluir Categoria de Mensagens"
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
      title="Nova Categoria de Mensagens"
    >
      <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
    </IconButton>
  </div>
);


const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Alterar Categoria de Mensagens" size="large" >
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

const ListarCategMsgs = () => {
  const { logout } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    listaCategMsgs();
    // eslint-disable-next-line
  }, [logout, token]);


  //GRID

  const cadastraCategMsgs = (lista) => {
    let dados = { lista, token };

    saveCategMsgs(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          window.alert("Categoria de Mensagens cadastrada com sucesso !!");
          listaCategMsgs();

        } else if (res.data === "duplicidade") {
          window.alert("Categoria de Mensagens já cadastrada !\nFavor verificar!!");

        } else {
          window.alert(" erro ao tentar cadastrar usuário");
        }
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const deletarCategMsgs = (idCategMsgs) => {

    let dados = { token, idCategMsgs: parseInt(idCategMsgs) };
    deleteCategMsgs(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          
          window.alert("Categoria de Mensagens excluída com sucesso !!");          
          listaCategMsgs();
        } else {
          window.alert(" erro ao tentar excluír usuário");
        }
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao Excluir !!")
      })
  }

  const listaCategMsgs = async () => {
    let dados = { token };
    await getCategMsgs(dados)
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
    { name: 'CTMN_DESCRICAO', title: `DESCRIÇÃO DA CATEGORIA DE MENSAGENS`, required: true }
  ]

  const [defaultColumnWidths] = useState([
    { columnName: 'CTMN_DESCRICAO', width: 500 }
  ]);
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);

  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      ID_CATEGORIA_MENSAGENS: null,
      CTMN_DESCRICAO: ""
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
        if (!(changedRows[i].ID_CATEGORIA_MENSAGENS)) {


          if (changedRows[i].CTMN_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição da Categoria de Mensagens");
          } else {
            cadastraCategMsgs(changedRows[i])
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

          if (changedRows[i].CTMN_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição da Categoria de Mensagens");
          } else {
            cadastraCategMsgs(changedRows[i])
          }
        }
      }
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => deletedSet.has(row.id));
      deletarCategMsgs(changedRows.map(l => l.ID_CATEGORIA_MENSAGENS));
      // setRows(changedRows);
    }
    setRows(changedRows);
  };
  return (


    <div className='container-fluid'>
      <h3 id='titulos'>Categoria de Mensagens</h3>
      <div className="card">
        <Paper>
          <Grid
            rows={rows}
            columns={columns}

          >
            <SortingState />
            <FilteringState
              defaultFilters={[{ columnName: "CTMN_DESCRICAO", value: "" }]} />
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
            // defaultEditingRowIds={}
            />
            <Table />
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

export default ListarCategMsgs;