import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {useNavigate } from "react-router-dom";
import apiProdutosService, { dataFormatadaListar, updateListaProd } from "../../Service/produtoService";
import { criando, formataValorString, valorBR, valorLiquido } from "../../Service/utilServiceFrontEnd";
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
  } from '@devexpress/dx-react-grid-bootstrap4';
import { getSeguradora } from "../../Service/seguradoraService";



const getRowId = row => row.id;

const ListarSeguradora =()=> {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout } = useContext(AuthContext);
    //const [desconto, setdesconto] = useState([]);
    const gridRef = useRef();

    const deletarProdutoID = (id) => {
        let dados = { id, token };
        if (window.confirm("deseja excluir o item ?")) {
            apiProdutosService.deleteProduto(dados)
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

    const deletarProduto = ()=>{
        const dadosSelecionados = gridRef.current.api.getSelectedNodes();
        dadosSelecionados.map(
            node => node.data.id);
            let id = [];
        dadosSelecionados.forEach((l)=>{
            id.push(l.data.PRDT_ID)
        })
        let dados = { id, token };
        if (window.confirm("deseja excluir o item ?")) {
                    apiProdutosService.deleteProduto(dados)
                        .then((res) => {
                            if (res.data === "erroLogin") {
                                window.alert("Sessão expirada, Favor efetuar um novo login");
                                logout();
                            } else {
                                alert(res.data);
                                window.location.reload();
                            }
                        })
                        .catch((res) => {
                            console.log(res);
                        })
                }
        // rowImmutableStore = rowImmutableStore.filter(
        //     linhas =>idSelecionados.indexOf(linhas.id) <0);
        // setRowData(rowImmutableStore);
    }

  const CorFundo =()=>{
      return  {backgroundColor : '#DCDCDC', margin : "1px"};
  }
  let valor = 0;
    const [columns] = useState([

       { name: 'SGRA_CNPJ', title: "CNPJ"},
        { name: 'SGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL"},
         { name: 'SGRA_CIDADE', title: "CIDADE" }        
    

    ]);

   const [editingStateColumns] = useState([
    {columnName : "PRDT_ID",editingEnabled: false},
    {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
    {columnName : "PRDT_VALOR",align: 'center'},

   ])
   
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



    const listarSeguradoras = ()=> {
        //  setdataN(new Date());
        let dados = { token };
        getSeguradora(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login");
                 return   logout();
                } else {                   
                    (res.data).forEach((item, index) => (item.id = index));                 
                  return  setRows(res.data);
                }
            })
            .catch((res) => {
              return  console.log(res);
            })
    };

    console.log(rows);

    const updateProdutos = () => {
        let dados = { lista: rows, token };       
        updateListaProd(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login");
                    logout();
                } else {
                    alert(res.data)
                    window.location.reload();
                }

            })
            .catch((err) => {
                console.error("erro ao ataulizar", err)
            })
    }



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
          setRows(changedRows);
        }
        if (changed) {
          changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
          setRows(changedRows);
        }
        if (deleted) {
            
         const deletedSet = new Set(deleted);
          changedRows = rows.filter(row => deletedSet.has(row.id)  );         
         deletarProdutoID(changedRows.map(l=>l.PRDT_ID));         
        }       
      };

    
    

    return (
        <div className="container-fluid">

            <h1>Listar Produtos</h1>

            <div className="centralizar">
                <button onClick={() => navigate("/home")}  > HOME</button>
                <button onClick={(e)=>navigate("/cadastroSeguradora")}>CADASTRAR UNIDADE EMPRESARIAL</button>
             {/* <button type='button' onClick={deletarProduto}>EXCLUIR SELECIONADOS</button>   */}
                <button onClick={(e) => updateProdutos(e)}  > SALVAR ALTERAÇÕES</button>
                <button onClick={(e) => logout(e)}  > SAIR</button>
            </div>


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
        {/* <PriceProvider
        for={priceColumns}
        
        /> */}
        
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


        </div>

    )

}

export default ListarSeguradora;