import Paper from '@mui/material/Paper';

import "./JustificativaItem.css";
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
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { saveJustificativaItem, getJustificativaItem, deleteJustificativaItemID } from "../../Service/justificativaItemService";
import { getAcessoUserMenu } from '../../Service/usuarioService';
import { validaDescricao } from '../../Service/utilServiceFrontEnd';


const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Deseja excluir esta Justificativa do Item ?')) {
        onExecute();
      }
    }}
    title="Excluir Justificativa do Item"
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
      title="Nova Justificativa do Item"
    >
      <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
    </IconButton>
  </div>
);


const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Alterar Justificativa do Item" size="large" >
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

let acessoGeral = false;

const JustificativaItem = () => {

  const { logout, nomeUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  // const [descricaoJustificativaItem, setDescricaoJustificativaItem] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const acessoMenuUser = async () => {
      let dados = { token, usuario: nomeUser() };
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
            (res.data).forEach((ac) => {
              if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                acessoGeral = true;
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
  }, [])

  useEffect(() => {
    listaJustificativaItem();
  }, [logout, token]);

  const cadastraJustificativaItem = (lista) => {
    let dados = { lista, token, acessoGeral };

    // console.log('cadastrar Justificativa do Item', lista);

    if (!validaDescricao(lista.JSIT_DESCRICAO)) {
      return { mensagem: 'Erro de Validação da Descrição da Justificativa do Item' };
    }

    saveJustificativaItem(dados)
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
          if (lista.ID_JUSTIFICATIVA_ITEM > 0) {
            window.alert("Justificativa do Item Alterada com Sucesso!!!");
          } else {
            window.alert("Justificativa do Item Cadastrada  com Sucesso!!!");
          }
          // listaJustificativaItem(); // sempre chamar a lista no caso de cadastro simples.
        }

        listaJustificativaItem();
      })
      .catch((err) => {
        console.error('Erro ao Cadastrar Justificativa do Item', err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const deletarJustificativaItem = (justificativaItemID) => {

    let dados = { token, acessoGeral, justificativaItemID: parseInt(justificativaItemID) };
    deleteJustificativaItemID(dados)
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
          alert("Erro a tentar excluir!!!");
        } else {
          window.alert("Justificativa do Item excluída com sucesso !!");
          listaJustificativaItem();
        }
      })
      .catch((err) => {
        console.error('Erro ao Excluir Justificativa do Item', err);
        window.alert("Erro ao Excluir !!")
      })
  }

  const listaJustificativaItem = async () => {
    let dados = { token, acessoGeral };
    await getJustificativaItem(dados)
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
        console.error('Erro ao Listar Justificativa do Item', err);
        window.alert("Erro ao Listar !!")
      })
  }

  const columns = [
    { name: 'JSIT_DESCRICAO', title: `DESCRIÇÃO DA JUSTIFICATIVA DO ITEM`, required: true }
  ]

  const [defaultColumnWidths] = useState([
    { columnName: 'JSIT_DESCRICAO', width: 450 }
  ]);
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);

  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      ID_JUSTIFICATIVA_ITEM: null,
      JSIT_DESCRICAO: ""
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
        if (!(changedRows[i].ID_JUSTIFICATIVA_ITEM)) {


          if (changedRows[i].JSIT_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição da Justificativa do Item");
          } else {
            cadastraJustificativaItem(changedRows[i])
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

          if (changedRows[i].JSIT_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição da Justificativa do Item");
          } else {
            cadastraJustificativaItem(changedRows[i])
          }
        }
      }
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => deletedSet.has(row.id));
      deletarJustificativaItem(changedRows.map(l => l.ID_JUSTIFICATIVA_ITEM));
      // setRows(changedRows);
    }
    setRows(changedRows);
  };
  return (
    <div className='container-fluid'>
      <h3 id='titulos'>Justificativa do Item: </h3>
      {/* <ArrowBackIcon titleAccess="Voltar" style={{ color: "green" }} className="margemRight" onClick={(e) => navigate(`/ListarJustificativaItem`)} type="button" /> */}
      <div className="container">

        <Paper>

          <Grid
            rows={rows}
            columns={columns}
          >
            <SortingState
            />
            <FilteringState
              defaultFilters={[{ columnName: "JSIT_DESCRICAO", value: "" }]} />
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

export default JustificativaItem;