let livros = []
const elementoComValorTotal = document.querySelector('#valor_total_livros_disponiveis')
const endpointApi = 'https://guilhermeonrails.github.io/casadocodigo/livros.json'
const elementoParaAddLivros = document.querySelector('#livros')
getBuscarLivrosDaApi()

async function getBuscarLivrosDaApi(){
    var resultado = await fetch(endpointApi)
    livros = await resultado.json()
    let livrosComDesconto = aplicarDesconto(livros)
    exibirLivrosNaTela(livrosComDesconto)
}

//forEach
function exibirLivrosNaTela(listaDeLivros){
	elementoComValorTotal.innerHTML = ''
	elementoParaAddLivros.innerHTML = ''
	
    listaDeLivros.forEach(livro => {
		let disponibilidade = livro.quantidade ? '' : 'indisponivel'
        elementoParaAddLivros.innerHTML += `
        <div class="livro">
      <img class="livro__imagens ${disponibilidade}" src="${livro.imagem}" alt="${livro.alt}" />
      <h2 class="livro__titulo">
        ${livro.titulo}
      </h2>
      <p class="livro__descricao">${livro.autor}</p>
      <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
      <div class="tags">
        <span class="tag">${livro.categoria}</span>
      </div>
    </div>
        `
    })
}

//map
function aplicarDesconto(livros){
    const desconto = 0.3;

    livrosComDesconto = livros.map(livro => {
        return {...livro,preco: livro.preco - (livro.preco * desconto)}
    })
    return livrosComDesconto
}

//filter
const botoes = document.querySelectorAll('.btn')

botoes.forEach(botao => {
	botao.addEventListener('click', filtrarLivros)
})

function filtrarLivros(){
	const elementoBtn = document.getElementById(this.id)
	const categoria = elementoBtn.value
	let livrosFiltrados = categoria == 'disponivel' ? filtrarPorDisponibilidade() : filtrarPorCategoria(categoria)
	exibirLivrosNaTela(livrosFiltrados)
	if(categoria == 'disponivel'){
		const valorTotal = calcularValorTotalDisponiveis(livrosFiltrados)
		console.log(valorTotal);
		exibirValorTotalLivros(valorTotal)
	}
}

//sort
let btnOrdenacaoPreco = document.querySelector('#btnOrdenarPorPreco')
btnOrdenacaoPreco.addEventListener('click', ordenarPorPreco)

function ordenarPorPreco(){
	let livrosOrdenados = livros.sort((a, b) => a.preco - b.preco)
	exibirLivrosNaTela(livrosOrdenados)
}

function filtrarPorCategoria(categoria) {
	return livros.filter(livro => livro.categoria == categoria)
}

function filtrarPorDisponibilidade() {
	return livros.filter(livro => livro.quantidade > 0)
}


function exibirValorTotalLivros(valor){
	elementoComValorTotal.innerHTML += `
	<div class="livros__disponiveis">
		<p>Todos os livros disponíveis por R$${valor} <span id="valor"></span></p>
	</div>
	`
}

//reduce
function calcularValorTotalDisponiveis(livros){
	return livros.reduce((acc, livro) => acc + livro.preco, 0).toFixed(2).replace('.', ',')
}