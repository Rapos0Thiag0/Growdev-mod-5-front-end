const url = "https://mod-5-be.herokuapp.com";
// const urlDev = "http://localhost:8080";

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const user = getParameterByName("nome");

const userUid = getParameterByName("uid");

const uidUserLogado = JSON.parse(localStorage.getItem("user_uid"));

verificarLogado();

async function verificarLogado() {
  if (!userUid) return (window.location.href = "./index.html");
  if (userUid !== uidUserLogado) return (window.location.href = "./index.html");
  await axios
    .get(`${url}/mensagens/${userUid}`)
    .then(() => {
      return mostrarTabela();
    })
    .catch((err) => {
      if (err.response.data.message === "USER_NOT_LOGGED") {
        window.location.href = "./index.html";
      }
    });
}

async function mostrarTabela() {
  await axios.get(`${url}/mensagens/${userUid}/all`).then((res) => {
    let msgs = res.data;
    console.log(res.data);
    const table = document.querySelector("#tbody");

    table.innerHTML = "";

    for (let i = 0; i < msgs.length; i++) {
      let id = msgs[i].uid;

      let tagTr = tbody.insertRow();

      let td_descricao = tagTr.insertCell();
      let td_detalhamento = tagTr.insertCell();
      let td_acoes = tagTr.insertCell();

      td_descricao.innerHTML = msgs[i].descricao;
      td_detalhamento.innerHTML = msgs[i].detalhamento;

      let imgEditar = document.createElement("img");
      imgEditar.src = "./img/edit.svg";
      imgEditar.setAttribute("onclick", `selecionaLinhaEditavel("${id}")`);

      let imgExcluir = document.createElement("img");
      imgExcluir.src = "./img/delet.svg";
      imgExcluir.setAttribute("onclick", `apagarLinha("${id}")`);

      td_acoes.appendChild(imgEditar);
      td_acoes.appendChild(imgExcluir);
    }
  });
}

async function apagarLinha(posicao) {
  let id = posicao;

  if (confirm("Deseja realmente deletar esta mensagem?")) {
    await axios.delete(`${url}/mensagens/${userUid}/${id}`).catch((error) => {
      console.log(error);
    });
    mostrarTabela();
  }
}

async function selecionaLinhaEditavel(posicao) {
  let id = posicao;
  await axios
    .get(`${url}/mensagens/${userUid}/${id}`)
    .then((res) => {
      let msg = res.data;
      let novaDesc = msg.descricao;
      let novoDet = msg.detalhamento;
      document.querySelector("#descricaoRecados").value = novaDesc;
      document.querySelector("#detalhamentoRecados").value = novoDet;
    })
    .then(async () => {
      editar(id);
    });
}

async function editar(posicao) {
  let id = posicao;
  const botaoAtualizar = document.querySelector("#botaoAtualizarRecados");

  botaoAtualizar.addEventListener("click", async () => {
    const desNova = document.querySelector("#descricaoRecados").value;
    const detNovo = document.querySelector("#detalhamentoRecados").value;

    if (!desNova || !detNovo) {
      alert("Preencha os campos de descrição e detalhamento!");
    } else {
      await axios
        .put(`${url}/mensagens/${userUid}/${id}`, {
          descricao: desNova,
          detalhamento: detNovo,
        })
        .then(() => {
          resetarInputs();
          mostrarTabela();
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  });
}

async function addMensagem(desc, det) {
  const descricaoNova = desc;
  const detalhamentoNovo = det;
  if (!descricaoNova || !detalhamentoNovo) {
    alert("Preencha os campos de descrição e detalhamento!");
  } else {
    await axios
      .post(`${url}/mensagens/${userUid}`, {
        descricao: descricaoNova,
        detalhamento: detalhamentoNovo,
      })
      .then(() => {
        mostrarTabela();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const botaoSalvar = document.querySelector("#botaoSalvarRecados");
botaoSalvar.addEventListener("click", () => {
  const descricaoNova = document.querySelector("#descricaoRecados").value;
  const detalhamentoNovo = document.querySelector("#detalhamentoRecados").value;

  addMensagem(descricaoNova, detalhamentoNovo);
  resetarInputs();
});

function resetarInputs() {
  document.querySelector("#descricaoRecados").value = "";
  document.querySelector("#detalhamentoRecados").value = "";
}

function logout() {
  localStorage.removeItem("user_uid");
  location.href = "index.html";
}