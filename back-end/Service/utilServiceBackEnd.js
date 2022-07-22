
const dataBRa = (data) => {
  return (
    new Date(data).getFullYear() + "-" +
    ((new Date(data).getMonth() + (1)) < 10 ?
      "0" + (new Date(data).getMonth() + (1)) :
      (new Date(data).getMonth() + (1))
    ) + "-" +
    ((new Date(data).getDate()) < 10 ?
      "0" + (new Date(data).getDate()) :
      (new Date(data).getDate())

    )
  )
}
const dataBR = (data) => {
  return (
    ((new Date(data).getDate()) < 10 ? "0" + new Date(data).getDate() : new Date(data).getDate()) + "/"
    + ((new Date(data).getMonth() + (1)) < 10 ? "0" + (new Date(data).getMonth() + (1)) : (new Date(data).getMonth() + (1))) + "/"
    + new Date(data).getFullYear()
  )
}

const valorBR = (data) => {
  return data.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

const formataArrayStr = (id) => {
  let ids = "";
  id.map(l => ids += `'${l}',`);
  return ids.substring(0, ids.length - 1)

}

const formataValorString = (valor) => {
  if (typeof (valor) === "string") {
    return valor.replace(",", ".");
  }
  return valor;
}
const valorLiquido = (valor, desconto) => {
  return (formataValorString(valor) - (formataValorString(valor) * (formataValorString(desconto) / 100)));
}


const apenasNr = (nr) => {

  let nr1 = (isNaN(nr)) ? nr.replace(/\D/g, '') : nr;
  return nr1;
}






module.exports = { apenasNr, formataValorString, valorLiquido, dataBR, formataArrayStr };



// const multer  = require('multer');
// const storage = multer.diskStorage({
//   destination : (req,file,cb)=>{
//     cb(null,'uploads/')
//   },
//   filename : (req, file, cb)=>{
//     cb(null, "logo.jpeg")
//   }
// });
// const upload = multer({storage : storage});




// const fs = require('fs');
// const str = fs.readFileSync('uploads/logo.jpeg');

