import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {useNavigate } from "react-router-dom";
import apiProdutosService, { dataFormatadaListar, updateListaProd } from "../../Service/produtoService";
import { criando, formataValorString, valorBR, valorLiquido } from "../../Service/utilServiceFrontEnd";
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState, IntegratedPaging, PagingState } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    PagingPanel
  } from '@devexpress/dx-react-grid-bootstrap4';
import { deleteSeguradora, deleteSeguradoraID, getContatoSeguradora, getSeguradora, saveContatoSeguradora } from "../../Service/seguradoraService";
import { Button, Modal } from "react-bootstrap";



const getRowId = row => row.id;

const ListarSeguradora =()=> {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout } = useContext(AuthContext);

    const [listaSeg, setListaSeg] = useState([]);
    const gridRef = useRef();

    const deletarSeguradora = (idSeg) => {
        
        let dados = { idSeg, token };
      
        if (window.confirm("deseja excluir o item ?")) {
            deleteSeguradoraID(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        window.alert("Sessão expirada, Favor efetuar um novo login");
                        logout();
                    } else {
                        alert(res.data);
                        listarSeguradoras();
                    }
                })
                .catch((res) => {
                    console.log(res);
                })
        }

    };

 
 
    const [columns] = useState([ 
        { name: 'ID_SEGURADORA_CONTATO', title: "ID"}, 
        { name: 'SGCO_NOME', title: "Nome Contato"}, 
        { name: 'SGCO_FUNCAO', title: "FUNÇÃO" },       
        {name: 'SGCO_DEPARTAMENTO', title: "DEPARTAMENTO"},
        { name: 'SGCO_EMAIL', title: "EMAIL"}, 
        { name: 'SGCO_URL', title: "URL"},
         { name: 'SGCO_CELULAR_DDD', title: " DDD"}, 
         { name: 'SGCO_CELULAR_NUMERO', title: " NR CELULAR"},   
         { name: 'SGCO_CELULAR_OPERADORA', title: " OPERADORA"},         
         { name: 'SGCO_FONE_COMERCIAL_DDD', title: " DDD"},   
         { name: 'SGCO_FONE_COMERCIAL_NUMERO', title: " NR COMERCIAL"},   
         { name: 'SGCO_FONE_COMERCIAL_RAMAL', title: " RAMAL"},     

    ]);

   const [editingStateColumns] = useState([
    {columnName : "SGRA_CNPJ",editingEnabled: false},
    {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
    {columnName : "PRDT_VALOR",align: 'center'},

   ])

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
      buscarContatos();
      setRows(changedRows);
      salvarContato(changedRows);
    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      setRows(changedRows);
    }
    if (deleted) {
        
     const deletedSet = new Set(deleted);

  changedRows = rows.filter(row => !deletedSet.has(row.id));
  setRows(changedRows);
    //   changedRows = rows.filter(row => deletedSet.has(row.id)  );         
    //  deletarProdutoID(changedRows.map(l=>l.PRDT_ID));         
    }       
  };

  const salvarContato = (rows)=>{
    const dadosContato = {contatos : rows, token}
    saveContatoSeguradora(dadosContato)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        alert("Sessão expirada, Favor efetuar um novo login !!");
                        //logout();
                        window.location.reload();
                    }
                    else if (res.data === "semAcesso") {
                        alert("Usuário sem permissão !!!");                                

                    } else if (res.data === "campoNulo") {
                        alert("Preencha todos os Campos obrigatorios!!!");
                    }
                    else if (res.data === "sucesso") {
                        alert("Contato Cadastrado  com Sucesso!!!");     
                        
                    }

                    else {
                        alert("Erro ao cadastrar");                              

                    }

                }).catch((error)=> {
                console.log(error,
                    "Erro ao salvar Contato");
                
            })

}


 
   
//    const PriceFormatter = ({value})=>(
//     valorBR(value)
//    )

//    const PriceProvider = props =>(
//     <DataTypeProvider
//         formatterComponent={PriceFormatter}
//         {...props}
    
//     />
//    )
 

  
//    const [priceColumns] = useState(["PRDT_VALOR","PRDT_VALOR_LIQUIDO"]);

    useEffect(() => {
        listarSeguradoras();
     
        
    }, []);



    const buscarContatos =(idSeg)=>{
        const dados = {token, idSeg}       
            getContatoSeguradora(dados)
            .then((res)=>{
                (res.data).forEach((item, index) => (item.id = index)); 
               setRows(res.data);
               setShow(true);
                    
              
            });
    
    }



    const listarSeguradoras = ()=> {
        //  setdataN(new Date());
        let dados = { token };
        getSeguradora(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login");
                 return   logout();
                } else {                   
                                   
                  return  setListaSeg(res.data);
                }
            })
            .catch((res) => {
              return  console.log(res);
            })
    };

 

   
 
    //   const EditSeguradoras = ({value})=>(
    //     <div>
    //          <Button variant="info" className="margemRight"onClick={(e)=>navigate(`/cadastroSeguradora/${value}`)}>EDIT</Button> 
    //          <Button variant="danger" className="margemRight" onClick={(e)=>deletarSeguradora(value)}>EXCLUIR</Button>
    //          <Button variant="primary" onClick={(e)=>buscarContatos(value)}>CONTATOS</Button>

    //     </div>       
       
    //    )    
    //    const EditSeguradorasProv = props =>(
    //     <DataTypeProvider
    //         formatterComponent={EditSeguradoras}
    //         {...props}        
    //     />
    //    )

    // const [editSeg] = useState(["ALTERACAO"]);
  
    
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        navigate("/listarSeguradora")
    }
    const handleShow = () => setShow(true);
    return (
        <div className="container-fluid">

            <h1>Listar Produtos</h1>

            <div className="centralizar">
                <button onClick={() => navigate("/home")}  > HOME</button>
                <button onClick={(e)=>navigate("/cadastroSeguradora/0")}>CADASTRAR UNIDADE EMPRESARIAL</button>           
                <button onClick={(e) => logout(e)}  > SAIR</button>
            </div>
            <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>CNPJ</th>
                        <th>RAZÃO SOCIAL</th>
                        <th>CIDADE</th>
                        <th>ALTERAR</th>
                        <th>CONTATOS</th>
                        <th>EXCLUSÃO</th>

                    </tr>
                </thead>
                <tbody>
                    {listaSeg.map(l=>
                    <tr key={l.ID_SEGURADORA}>
                        <td>{l.SGRA_CNPJ} </td>
                        <td>{l.SGRA_RAZAO_SOCIAL} </td>
                        <td> {l.SGRA_CIDADE}</td>             
             
                        <td><Button variant="info" className="margemRight"onClick={(e)=>navigate(`/cadastroSeguradora/${l.ID_SEGURADORA}`)}>EDIT</Button> </td>
                        <td><Button variant="primary" onClick={(e)=>buscarContatos(l.ID_SEGURADORA)}>CONTATOS</Button> </td>
                        <td><Button variant="danger" className="margemRight" onClick={(e)=>deletarSeguradora(l.ID_SEGURADORA)}>EXCLUIR</Button> </td>

                    </tr>
                    )}
                </tbody>

            </table>
            </div>


            <Modal show={show} onHide={handleClose}  size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>


            <div className="card">
      <Grid
        rows={rows}        
        columns={columns}
        getRowId={getRowId}
      >
        <EditingState
           onCommitChanges={commitChanges}
          columnExtensions={editingStateColumns}
        />
        {/* <EditSeguradorasProv
        for={editSeg}
        
        /> */}
        <PagingState
          defaultCurrentPage={0}
          pageSize={3}
        />
        <IntegratedPaging />
        <PagingPanel />
        
        <Table  />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          
        />
        
      </Grid>
    </div>
    </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


        </div>

    )

}

export default ListarSeguradora;