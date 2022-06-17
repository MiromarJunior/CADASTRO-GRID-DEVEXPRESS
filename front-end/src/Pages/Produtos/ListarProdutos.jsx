/**
 * Utilizando o sistema de GRID, listamos, editamos e cadastramos novos produtos.
 */

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



const getRowId = row => row.id;

function ListarProdutos() {
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
                        buscarProdutos();
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

       { name: 'PRDT_ID', title: "ID"},
        { name: 'PRDT_DESCRICAO', title: "DESCRIÇÃO"},

        { name: 'PRDT_CODIGO', title: "CÓDIGO" },       
        {name: 'PRDT_VALOR', title: "VALOR",
        getCellValue: row => (              
            isNaN(row.PRDT_VALOR) ? formataValorString(row.PRDT_VALOR) : row.PRDT_VALOR
            
        )
    
    
            },
        { name: 'PRDT_DT_VALIDADE', title: "DATA VALIDADE"}, 
        { name: 'PRDT_PERC_DESCONTO', title: " % DESCONTO"
         },
         { name: 'PRDT_VALOR_LIQUIDO', title: " VALOR LIQUIDO",
        getCellValue: row => (              
            isNaN(row.PRDT_PERC_DESCONTO) ? row.PRDT_VALOR - (row.PRDT_VALOR * (formataValorString(row.PRDT_PERC_DESCONTO)/100)) 
            : row.PRDT_VALOR - (row.PRDT_VALOR * (row.PRDT_PERC_DESCONTO/100))  
        )           
      },
      

    ]);

   const [editingStateColumns] = useState([
    {columnName : "PRDT_ID",editingEnabled: false},
    {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
    {columnName : "PRDT_VALOR",align: 'center'},

   ])
   
   const PriceFormatter = ({value})=>(
    valorBR(value)
   )

   const PriceProvider = props =>(
    <DataTypeProvider
        formatterComponent={PriceFormatter}
        {...props}
    
    />
   )
 

  
   const [priceColumns] = useState(["PRDT_VALOR","PRDT_VALOR_LIQUIDO"]);

    useEffect(() => {
        buscarProdutos();
    }, []);



    const buscarProdutos = ()=> {
        //  setdataN(new Date());
        let dados = { token };
        apiProdutosService.getProdutos(dados)
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
        <div>

            <h1>Listar Produtos</h1>

            <div className="centralizar">
                <button onClick={() => navigate("/home")}  > HOME</button>
                <button onClick={(e)=>navigate("/cadastroUnidadeEmpresarial")}>CADASTRAR UNIDADE EMPRESARIAL</button>
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
        <PriceProvider
        for={priceColumns}
        
        />
        
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

export default ListarProdutos;



/** 
 * 
 * 
 * 
 *    {
            field: 'PRDT_PERC_DESCONTO', headerName: " % DESCONTO",
            
            
        },
        {
            field: 'PRDT_VALOR_LIQUIDO', headerName: " VALOR LIQUIDO",
            
            valueGetter: p => {
             return   valorLiquido(p.data.PRDT_VALOR,p.data.PRDT_PERC_DESCONTO)
               
            }
           
      },
 * 
 * // const formNumber  = Intl.NumberFormat("pt-BR", {
// style : "currency",
// currency : "BRL",
// minimumFractionDigits: 2
// })
const onButtonClick = (data) => {
        return gridRef.current.exportDataAsCsv(data);
    }
    const onBtExport = useCallback(() => {
        console.log("ola")
        gridRef.current.api.exportDataAsCsv();
    }, []);



 * 
 * 
 *  // const adicionar = () => {    
    //     newData.push({
    //         id: rowData.length + 1,
    //         PRDT_DESCRICAO: '',
    //         PRDT_CODIGO: "",
    //         PRDT_VALOR: 0,
    //         PRDT_DT_VALIDADE: 'dd/mm/yyyy',
    //     })
    //     newData.concat(newData);
    //     let lista = newData.concat(rowImmutableStore);
    //     setRowData(lista);
    //     return lista;

    // }



//     function criar (){
// console.log(getRowId());
//        let newData ={
//             id : getRowId +1,        
//             PRDT_DESCRICAO: '',
//             PRDT_CODIGO: "",
//             PRDT_VALOR: 0,
//             PRDT_DT_VALIDADE: 'dd/mm/yyyy',
//         }
       

// return newData

//     }
 *    // const getRowId = useCallback((params) => params.data.id, []);
    // const onCellEditRequest = useCallback(
    //     (e)=>{
    //         const data = e.data;
    //         const field = e.colDef.field;
    //         const newValue = e.newValue;
    //         const newItem = {...data};
    //         newItem[field] = e.newValue;
           
    //         console.log('onCellEditRequest, updating ' + field + ' to ' + newValue);
    //         rowImmutableStore = rowImmutableStore.map((oldItem)=>oldItem.id === newItem.id ? newItem : oldItem);
    //         setRowData(rowImmutableStore);
    //     },
    //     [rowImmutableStore]
    // );

    // const cellClickedListener = useCallback(e=>{       
    //     console.log("celulaSelecionada",e.data.PRDT_VALOR);
    // },[]);

 * 

        // const adicionar = useCallback((addIndex) => {
        //     const newItems = [
        //         addRow(),
                

              
        //     ];
         
        // },[rowData]);
 
 * 
 * 
 * 
 * 
// function adicionar(e){
//     e.preventDefault();
//     rowImmutableStore.push(
//         {
//             PRDT_DESCRICAO: "",
//             PRDT_CODIGO: "",
//             PRDT_VALOR: "",
//             PRDT_DT_VALIDADE: "",
//             PRDT_ID: "",   
                         
            
        
//         },
//       setRowData(rowImmutableStore)

//     )
  
   
//    // console.log(rowData);
    

// }
// let newCount = 1;

// const onCellEditRequest = useCallback(
//     (e)=>{
//         const data = e.data;
//         const field = e.colDef.field;
//         const newValue = e.newValue;
//         const newItem = {...data};
//         newItem[field] = e.newValue;
       
//         console.log('onCellEditRequest, updating ' + field + ' to ' + newValue);
//         rowImmutableStore = rowImmutableStore.map((oldItem)=>oldItem.id === newItem.id ? newItem : oldItem);
//         setRowData(rowImmutableStore);
//     },
//     [rowImmutableStore]
// );

   


// const adicionar = () => {

//   const newData = {
//     PRDT_ID: 'Toyota ' + newCount,
//     PRDT_DESCRICAO: 'Celica ' + newCount,
//     PRDT_CODIGO: 35000 + newCount * 17,
//     PRDT_VALOR: 'Headless',
//     PRDT_DT_VALIDADE: 'Little',
  
//   };
//   newCount++;
 
//   return setRowData(rowImmutableStore.push(newData));
//   [rowImmutableStore]
// };












 * const adicionar = useCallback(
        (e)=>{
            const newData =[ {
                PRDT_ID: newCount,
                PRDT_DESCRICAO: '0 ' + newCount,
                PRDT_CODIGO: 35000 + newCount * 17,
                PRDT_VALOR: 'Headless',
                PRDT_DT_VALIDADE: 'Little',
              
              }];
              newCount++;
            let lista  = rowImmutableStore.concat(newData);
              console.log(lista)
             
              return setRowData(lista);
           
        },
        [rowImmutableStore]
    );
 * 
 * 
 * 
 * 
 * 
 * <div className="centralizar tableLista" >
         <table>
         <tbody>
                 <tr style={{backgroundColor : "silver"}} >
                     <th>DESCRIÇÃO</th>
                     <th>CÓDIGO</th>
                     <th>VALOR</th>
                     <th>DATA VENCIMENTO</th>
                     <th>ALTERAÇÃO</th>
                     <th>EXCLUIR</th>

                 </tr>
             </tbody>

             <tbody>         
                      { listaProdutos.map((a)=>
                 <tr key={a.PRDT_ID}>
                     <th>{a.PRDT_DESCRICAO}</th>
                     <th>{a.PRDT_CODIGO}</th>
                     <th className="alinharDir" >{(a.PRDT_VALOR).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</th>
                     <th>            
                         {apiProdutosService.dataFormatadaListar(a.PRDT_DT_VALIDADE)}
                     </th>


                     <th>
                         <button onClick={()=>navigate( `/cadastrarProdutos/${a.PRDT_ID}`)}>EDITAR</button>
                         </th>


                         <th>
                         <button onClick={()=>deletarProduto(a.PRDT_ID)}>EXCLUIR</button>                      
                            </th>
            
                 </tr>

                  )} 

             </tbody> 
             



             </table>  
             </div>        */ 