import React, { useState, useEffect } from "react";
import axios from "axios";
import Main from "../../template/Main";

const baseUrl = "http://localhost:3001/pessoas";

// Dados do cabeçalho
const headerProps = {
  icon: "users",
  title: "Pessoas",
  subtitle: "Cadastro de Pessoas",
};

// Dados iniciais do form
const initialState = { name: "", email: "", telefone: "", cpf: "" };

export default function PessoaCrud() {
  const [pessoa, setPessoa] = useState(initialState);
  const [pessoaList, setItems] = useState([]);

  // Carregar os dados quando tem mudança na lista de pessoas
  useEffect(() => {
    const getAllPessoas = async () => {
      const allPessoas = await retrievePessoas();
      if (allPessoas) setItems(allPessoas);
    };
    getAllPessoas();
  }, []);

  // Recupera os dados da api
  const retrievePessoas = async () => {
    try {
      const response = await axios.get(baseUrl);
      setItems(response.data);
    } catch (e) {
      console.error(e.message);
    }
  };

  // Salvar os dados
  const save = () => {
    // Verifica os campos
    if (
      pessoa.name === "" ||
      pessoa.email === "" ||
      pessoa.telefone === "" ||
      pessoa.cpf === ""
    ) {
      alert("Preencha todos os campos!");
      return;
    }
    // Verifica se tem id para usar put ou post
    const method = pessoa.id ? "put" : "post";
    // Se a url tiver id ele vai atualizar, se não vai criar
    const url = pessoa.id ? `${baseUrl}/${pessoa.id}` : baseUrl;

    axios[method](url, pessoa)
      .then((res) => {
        // list usa uma função que retorna uma nova lista com o ultimo elemento adicionado
        const list = getUpdateList(res.data);
        // Atualiza a lista
        setItems(list);
        // Limpa os campos
        clear();
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  // Nova lista adicionando nova pessoa
  const getUpdateList = (data) => {
    // Gera uma nova lista
    const list = pessoaList.filter((pessoa) => pessoa.id !== data.id);
    // Adiciona no inicio
    list.unshift(data);
    // Retorna a lista
    return list;
  };

  // Limpa os campos
  const clear = () => {
    setPessoa(initialState);
  };

  // Atualiza os campos
  const updateField = (event) => {
    // Setar os dados
    setPessoa({
      ...pessoa,
      [event.target.name]: event.target.value,
    });
  };

  // Formulário
  function renderForm() {
    return (
      <div clasName="form">
        <div clasName="row">
          <div clasName="col-12 col-md-6">
            <div clasName="form-group">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={pessoa.name}
                onChange={(e) => updateField(e)}
                placeholder="Digite o nome"
              />
            </div>
          </div>
          <div clasName="col-12 col-md-6">
            <div clasName="form-group">
              <label>E-mail</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={pessoa.email}
                onChange={(e) => updateField(e)}
                placeholder="Digite o e-mail"
              />
            </div>
          </div>
          <div clasName="col-12 col-md-6">
            <div clasName="form-group">
              <label>Telefone</label>
              <input
                type="text"
                className="form-control"
                name="telefone"
                value={pessoa.telefone}
                onChange={(e) => updateField(e)}
                placeholder="Digite o telefone"
              />
            </div>
          </div>
          <div clasName="col-12 col-md-6">
            <div clasName="form-group">
              <label>CPF</label>
              <input
                type="text"
                className="form-control"
                name="cpf"
                value={pessoa.cpf}
                onChange={(e) => updateField(e)}
                placeholder="Digite o CPF"
              />
            </div>
          </div>
        </div>
        <hr />
        <div clasName="row">
          <div clasName="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={(e) => save(e)}>
              {" "}
              Salvar
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={(e) => clear(e)}
            >
              {" "}
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Recebe uma pessoa por parametro e atualiza o estado com uma nova pessoa
  const load = (pessoa) => {
    setPessoa(pessoa);
  };

  // Remover pessoa
  const remove = (pessoaSelected) => {
    axios
      // Passa por parametro a url e o id da pessoa
      .delete(`${baseUrl}/${pessoaSelected.id}`)
      .then((res) => {
        // Retorna uma nova lista sem a pessoa deletada
        const newList = pessoaList.filter((u) => u !== pessoaSelected);
        retrievePessoas(newList);
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  // Tabela
  function renderTable() {
    return (
      <table className="table mt-4 table-bordered">
        <thread>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thread>
        <tbody>{renderRows()}</tbody>
      </table>
    );
  }

  // Linhas da tabela
  function renderRows() {
    return pessoaList.map((pessoa) => {
      return (
        // Adiciona os dados da pessoa
        <tr key={pessoa.id}>
          <td>{pessoa.id}</td>
          <td>{pessoa.name}</td>
          <td>{pessoa.email}</td>
          <td>{pessoa.telefone}</td>
          <td>{pessoa.cpf}</td>
          <td>
            {/* Botão de atualizar - Chama o load passando a pessoa */}
            <button className="btn btn-warning" onClick={() => load(pessoa)}>
              <i className="fa fa-pencil"></i>
            </button>
            {/* Botão de remover - Chama o remove passando a pessoa */}
            <button
              className="btn btn-danger ml-2"
              onClick={() => remove(pessoa)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <Main {...headerProps}>
      {renderForm()}
      {renderTable()}
    </Main>
  );
}
