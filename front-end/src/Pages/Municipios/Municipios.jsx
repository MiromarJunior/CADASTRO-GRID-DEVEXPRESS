/*
* Lista de Municipios cadastradas no sistema.
* Listar, cadastrar e atualizar os registros.
*/
import Paper from '@mui/material/Paper';

import "./Municipios.css";
import {
  DataTypeProvider,
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  SortingState
} from '@devexpress/dx-react-grid';

import {
  Grid,
  Table,
  DragDropProvider,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableFilterRow,
  TableColumnResizing,
  TableColumnReordering,
  PagingPanel,
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

import { getAcessoUserMenu } from '../../Service/usuarioService';
import { validaMunicipio } from '../../Service/utilServiceFrontEnd';
import { deleteMunicipiosID, getMunicipios, saveMunicipios } from '../../Service/municipiosService';
import { getUnidadeFederativa } from '../../Service/enderecoService';

let acessoGeral = false;

const Municipios = () => {
  const { logout, nomeUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  // const [regDescricao, setRegDescricao] = useState([]);
  // const { idReg } = useParams();
  const navigate = useNavigate();
  const [listaUF, setListaUF] = useState([""]);
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);
  const [acessoList, setAcessoList] = useState(false);
  const [acessoDEL, setAcessoDEL] = useState(false);
  const [acessoCad, setAcessoCad] = useState(false);
  const [displayEDIT, setDisplayEDIT] = useState("none");
  const [displayDEL, setDisplayDEL] = useState("none");
  const [displayADD, setDisplayADD] = useState("none");

  const [columnsUF] = useState(['UNFE_SIGLA'])

  const listaMuni = "LIST_MUNICIPIO";
  const incluirMuni = "ADD_MUNICIPIO";
  const excluirMuni = "DEL_MUNICIPIO";
  const editarMuni = "EDIT_MUNICIPIO";

  const [pageSizes] = useState([5, 10, 15, 20, 0]);


  useEffect(() => {
    const acessoMenuUser = () => {
      let dados = { token, usuario: nomeUser() };
      getAcessoUserMenu(dados)
        .then((res) => {
          if (typeof (res.data) === "string") {
            window.alert("Erro ao buscar Dados de Acesso do Usuário!");
          } else {
            (res.data).forEach((ac) => {
              if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                acessoGeral = true;
                setDisplayADD("");
                setDisplayDEL("");
                setDisplayEDIT("");
                listaMunicipio();
              } else if (incluirMuni === ac) {
                setDisplayADD("");
                setAcessoCad(true);
              } else if (excluirMuni === ac) {
                setDisplayDEL("");
                setAcessoDEL(true);
              } else if (editarMuni === ac) {
                setDisplayEDIT("");
                setAcessoCad(true);
              } else if (listaMuni === ac) {
                setAcessoList(true);
                listaMunicipio();
              }
            });

            // setDisplayADD('');
            // setDisplayDEL('');
            // setDisplayEDIT('');
            // setAcessoList(true);
            // setAcessoCad(true);
            // setAcessoDEL(true);
            // console.log('Acesso como TRUE manualmente.');
          }
        })
        .catch((err) => {
          console.error('Erro no processo de verificação de acesso de usuário em Município', err);
          window.alert("Erro ao buscar Acesso do Usuário !!")
        })
    }

    acessoMenuUser();
    obterListaUF();
  }, [logout, token, nomeUser]);

  const cadastraMunicipio = (lista) => {
    let dados = { lista, token, acessoGeral: (acessoCad || acessoGeral), usuLogado: nomeUser() };
    // console.log('cadastrarMunicipio', lista);

    if (!(displayADD === "")) {
      // listaMunicipio();
      alert('Usuário sem permissão');
      return;
    }

    // Validacao ja presente antes da chamada do metodo.
    // if (!validaMunicipio(lista)) {
    //   return { mensagem: 'Erro de validação dos campos de Município!', }
    // }

    saveMunicipios(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          alert("Usuário sem permissão !!!");
        } else if (res.data === "campoNulo") {
          alert("Preencha todos os Campos obrigatorios!!!");
        } else if (res.data === "erroSalvar") {
          alert("Erro a tentar salvar ou alterar!!!");
        } else if (res.data === "sucesso") {
          alert("Município Cadastrado com sucesso !")
        } else {
          if (lista.ID_MUNICIPIO > 0) {
            window.alert("Município Alterado com Sucesso!!!");
          } else {
            window.alert("Município Cadastrado  com Sucesso!!!");
          }
          listaMunicipio();
        }
      })
      .catch((err) => {
        console.error('Erro ao Cadastrar Município', err);
        window.alert("Erro ao cadastrar !!")
      })

  };

  const deletarMunicipio = (municipioID) => {
    let dados = { token, acessoGeral: (acessoDEL || acessoGeral), municipioID: parseInt(municipioID) };

    if (!(displayDEL === '')) {
      listaMunicipio();
      alert('Usuário sem permissão');
      return;
    }

    deleteMunicipiosID(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          alert("Usuário sem permissão !!!");
        } else if (res.data === "campoNulo") {
          alert("Preencha todos os Campos obrigatorios!!!");
        } else if (res.data === "erroSalvar") {
          alert("Erro a tentar excluir!!!");
        } else {
          window.alert("Município excluído com sucesso !!");
          // listaMunicipio();
        }

        // quando erro de acesso nao deve travar apenas com o item aser ecluido, atualizar a lista.
        listaMunicipio();
      })
      .catch((err) => {
        console.error('Erro ao Excluir Município', err);
        window.alert("Erro ao Excluir !!")
      })
  };

  const listaMunicipio = async () => {
    let dados = { token, acessoGeral: (acessoList || acessoGeral) };
    await getMunicipios(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");
          navigate("/home");
        } else {
          (res.data).forEach((item, index) => (item.id = index));
          return setRows(res.data);
        }
      })
      .catch((err) => {
        console.error('Erro ao Listar Município', err);
        window.alert("Erro ao Listar !!")
      })
  };

  const DeleteButton = ({ onExecute }) => (
    <IconButton style={{ display: displayDEL }}
      onClick={() => {
        // eslint-disable-next-line
        if (window.confirm('Deseja excluir este Município ?')) {
          onExecute();
        }
      }}
      title="Excluir Município"
      size="large"
    >
      <DeleteForeverOutlinedIcon style={{ color: "red" }} />
    </IconButton>
  );

  const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
      <IconButton size="large" style={{ display: displayADD }}
        color="primary"
        onClick={onExecute}
        title="Novo Município"
      >
        <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
      </IconButton>
    </div>
  );

  const EditButton = ({ onExecute }) => (
    <IconButton style={{ display: displayEDIT }} onClick={onExecute} title="Alterar Município" size="large" >
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

  const obterListaUF = async () => {
    let dados = { token };

    // console.log('obterListaUF Iniciado');

    await getUnidadeFederativa(dados)// getGrupoAcesso(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");
        } else {
          // console.log('Resultado da consulta de UF', res.data, listaUF);
          return setListaUF(res.data);
        }
      })
      .catch((err) => {
        console.error('Erro ao obter a lista de UF para tela de Municipios', err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const ListaUFFormatter = ({ value }) => value ? value : "";

  const ListaUFEditor = ({ value, onValueChange }) => (
    <Select
      input={<Input />}
      value={value ? value : ""}
      onChange={event => onValueChange(event.target.value)}
      style={{ width: '100%' }}
    >
      {/* {console.log('value no ListaUFEditor -> ', value)} */}
      <MenuItem value="null" >
      </MenuItem>
      {value ? <MenuItem value="" >
        Selecione a UF
      </MenuItem> : ""}

      {listaUF.map((l, index) =>
        <MenuItem key={index} value={l.UNFE_SIGLA ? l.UNFE_SIGLA : "Sem Acesso"}>
          {l.UNFE_SIGLA}
        </MenuItem>
      )}
    </Select>
  );

  const ListaUFProvider = props => (
    <DataTypeProvider
      formatterComponent={ListaUFFormatter}
      editorComponent={ListaUFEditor}
      {...props}
    />
  );
  const columns = [
    { name: "MUNI_CODIGO", title: `Código *`, required: true, },
    { name: "MUNI_DESCRICAO", title: `Descrição *`, required: true, },
    { name: "UNFE_SIGLA", title: `UF *`, required: true, },
  ];

  const [defaultColumnWidths] = useState([
    { columnName: 'MUNI_CODIGO', width: 200 },
    { columnName: 'MUNI_DESCRICAO', width: 450 },
    { columnName: 'UNFE_SIGLA', width: 100 }
  ]);

  const editingStateColumnExtensions = ([
    { columnName: 'MUNI_CODIGO', editingEnabled: true },
    { columnName: 'MUNI_DESCRICAO', editingEnabled: true },
    { columnName: 'UNFE_SIGLA', editingEnabled: true },
  ]);

  const [columnOrder, setColumnOrder] = useState(['MUNI_CODIGO', 'MUNI_DESCRICAO',
    'UNFE_SIGLA',]);
  // const [rowChanges, setRowChanges] = useState({});
  // const [addedRows, setAddedRows] = useState([]);
  // const [editingRowIds, getEditingRowIds] = useState([]);

  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      ID_MUNICIPIO: null,
      MUNI_CODIGO: "",
      MUNI_DESCRICAO: "",
      UNFE_SIGLA: '',
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
        if (!(changedRows[i].ID_MUNICIPIO)) {
          if (validaMunicipio(changedRows[i])) {
            cadastraMunicipio(changedRows[i]);
          } else {
            // return;
          }
          // if (changedRows[i].MUNI_DESCRICAO === "") {
          //   window.alert("Favor Preencher campo Descrição do Município");
          // } else if (changedRows[i].MUNI_CODIGO === "") {
          //   window.alert("Favor Preencher campo Código do Município");
          // } else if (changedRows[i].UNFE_SIGLA === "") {
          //   window.alert("Favor Preencher campo UF do Município");
          // } else {
          //   cadastraMunicipio(changedRows[i])
          // }
          //cadastraUsuario(changedRows[i]);
        }
      }
      //setRows(changedRows);     
    }

    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {
          if (validaMunicipio(changedRows[i])) {
            cadastraMunicipio(changedRows[i]);
          } else {
            // return;
          }
          // if (changedRows[i].MUNI_DESCRICAO === "") {
          //   window.alert("Favor Preencher campo Descrição do Município");
          // } else if (changedRows[i].MUNI_CODIGO === "") {
          //   window.alert("Favor Preencher campo Código do Município");
          // } else if (changedRows[i].UNFE_SIGLA === "") {
          //   window.alert("Favor Preencher campo UF do Município");
          // } else {
          //   cadastraMunicipio(changedRows[i])
          // }
        }
      }
    }

    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => deletedSet.has(row.id));
      deletarMunicipio(changedRows.map(l => l.ID_MUNICIPIO));
      // setRows(changedRows);
    }

    setRows(changedRows);
  };

  return (
    <div className='container-fluid'>
      <h3 id='titulos'>Municípios: </h3>
      <div className="card">
        <Paper>
          <Grid
            rows={rows}
            columns={columns} >

            <ListaUFProvider
              for={columnsUF}
            />
            <SortingState
            />
            <FilteringState
              defaultFilters={[{ columnName: "MUNI_DESCRICAO", value: "" }]} />
            <IntegratedFiltering />
            <IntegratedSorting />

            <EditingState
              columnExtensions={editingStateColumnExtensions}
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={getEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={setRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={changeAddedRows}
              onCommitChanges={commitChanges}
            // defaultEditingRowIds={}
            />
            <DragDropProvider />
            <PagingState
              defaultCurrentPage={0}
              defaultPageSize={20}
            />
            <IntegratedPaging />
            <Table />
            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
            <TableHeaderRow
              showSortingControls
              contentComponent={TableComponentTitle}
            />
            <PagingPanel
              pageSizes={pageSizes}
            />
            <TableColumnReordering
              order={columnOrder}
              onOrderChange={setColumnOrder}
            />

            <TableEditRow />
            {(displayADD === "none" && displayDEL === "none" && displayEDIT === "none")
              ?
              ""
              : <TableEditColumn
                showEditCommand
                showDeleteCommand
                showAddCommand={!addedRows.length}
                commandComponent={Command}
              />}

            <TableFilterRow />
          </Grid>
        </Paper>
      </div>
    </div>
  )
}

export default Municipios;