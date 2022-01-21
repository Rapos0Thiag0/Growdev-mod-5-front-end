const url = "https://mod-5-be.herokuapp.com";
const urlDev = "http://localhost:8080";

// Classe de usuário
class User {
  constructor(nome, senha, senha2) {
    this.nome = nome;
    this.senha = senha;
    this.senha2 = senha2;
  }
}

// função que cria um novo usuário no DB
async function criaNovoUsuario(nome, senha, senha2) {
  const user = new User(nome, senha, senha2);
  await axios
    .post(`${url}/signup`, user)
    .then(() => {
      resetarInputs();
      window.location.pathname = "./index.html";
    })
    .catch((err) => {
      console.log(err.response.data);
      if (err.response.data.error === "EMPTY_FIELDS_ERROR") {
        modal1.style.display = "block";
      }
      if (err.response.data.error === "LENGHT_PASS_ERROR") {
        modal2.style.display = "block";
      }
      if (err.response.data.error === "NOT_MATCH_PASS_ERROR") {
        modal3.style.display = "block";
      }
      if (err.response.data.message === "ALREADY_EXIST_USER_ERROR") {
        modal4.style.display = "block";
      }
    });
}

// função que apaga os campos de texto após acionado o botaoCriar.
function resetarInputs() {
  document.querySelector("#usuarioNoNovaConta").value = "";
  document.querySelector("#senhaNoNovaConta").value = "";
  document.querySelector("#senha2NoNovaConta").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const usuario = document.querySelector("#usuarioNoNovaConta");
  const senha = document.querySelector("#senhaNoNovaConta");
  const senha2 = document.querySelector("#senha2NoNovaConta");
  const botaoCriar = document.querySelector("#botaoNovaConta");
  const modal1 = document.querySelector("#modal1");
  const modal2 = document.querySelector("#modal2");
  const modal3 = document.querySelector("#modal3");
  const modal4 = document.querySelector("#modal4");
  const botaoFecharModal1 = document.querySelector("#modal_1");
  const botaoFecharModal2 = document.querySelector("#modal_2");
  const botaoFecharModal3 = document.querySelector("#modal_3");
  const botaoFecharModal4 = document.querySelector("#modal_4");

  senha2.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      botaoCriar.click();
    }
  });

  botaoCriar.addEventListener("click", () => {
    criaNovoUsuario(usuario.value, senha.value, senha2.value);
  });

  botaoFecharModal1.addEventListener("click", () => {
    modal1.style.display = "none";
    resetarInputs();
  });
  botaoFecharModal2.addEventListener("click", () => {
    modal2.style.display = "none";
    resetarInputs();
  });
  botaoFecharModal3.addEventListener("click", () => {
    modal3.style.display = "none";
    resetarInputs();
  });
  botaoFecharModal4.addEventListener("click", () => {
    modal4.style.display = "none";
    resetarInputs();
  });
});
