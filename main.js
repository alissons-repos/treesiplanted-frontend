const baseURL = 'http://localhost:5000/trees';
let editingId = null; // Variável de estado para armazenar o ID da árvore que está sendo editada

/**
 * @description Função para buscar todas as árvores cadastradas no servidor via requisição GET
 *
 * @return {Promise<void>}
 */
const getTrees = async () => {
	await fetch(baseURL, {
		method: 'get',
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.length === 0) {
				const list = document.getElementById('myTreesList');
				const li = document.createElement('li');
				li.classList.add('list-item');
				li.classList.add('list');
				li.innerHTML = `
					<p class="main-info">Você ainda não registrou nenhuma árvore!</p><br />
					<p class="sub-info">🌳 Faça o certo. Torne o mundo mais bonito e agradável!</p>
				`;
				list.appendChild(li);
			} else {
				data.forEach((item) =>
					insertList(item.custom_name, item.species, item.location, item.planting_date, item.id)
				);
			}
		})
		.catch((error) => {
			console.error('Erro na função getTrees:', error);
		});
};

/**
 * @description Função para criar uma nova árvore no servidor via requisição POST
 *
 * @param {string} custom_name
 * @param {string} species
 * @param {string} location
 * @param {string} planting_date
 *
 * @return {Promise<void>}
 */
const createTree = async (custom_name, species, location, planting_date) => {
	const newTree = { custom_name, species, location, planting_date };

	await fetch(baseURL, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newTree),
	})
		.then((res) => {
			if (!res.ok) {
				alert('Erro ao criar a árvore. Tente novamente mais tarde.');
				throw new Error('Erro ao criar a árvore.');
			}
			alert('Parabéns! Uma nova árvore foi plantada.');
		})
		.catch((error) => {
			console.error('Erro na função createTree:', error);
		});
};

/**
 * @description Função para atualizar uma árvore já existente no servidor via requisição PUT
 *
 * @param {string} custom_name
 * @param {string} species
 * @param {string} location
 * @param {string} planting_date
 * @param {string} id
 *
 * @return {Promise<void>}
 */
const updateTree = async (custom_name, species, location, planting_date, id) => {
	const newTree = { custom_name, species, location, planting_date };

	await fetch(`${baseURL}/${id}`, {
		method: 'put',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newTree),
	})
		.then((res) => {
			if (!res.ok) {
				alert('Erro ao atualizar a árvore. Tente novamente mais tarde.');
				throw new Error('Erro ao atualizar a árvore.');
			}
			alert('Árvore atualizada com sucesso.');
		})
		.catch((error) => {
			console.error('Erro na função updateTree:', error);
		});
};

/**
 * @description Função para deletar uma árvore já existente no servidor via requisição DELETE
 *
 * @param {string} id
 *
 * @return {Promise<void>}
 */
const deleteTree = async (id) => {
	await fetch(`${baseURL}/${id}`, {
		method: 'delete',
	})
		.then((res) => {
			if (!res.ok) {
				alert('Erro ao deletar a árvore. Tente novamente mais tarde.');
				throw new Error('Erro ao deletar a árvore.');
			}
			alert('Árvore deletada com sucesso.');
		})
		.catch((error) => {
			console.error('Erro na função deleteTree:', error);
		});
};

/**
 * @description Função para enviar os dados do formulário para o servidor, seja para criação ou atualização de uma árvore
 *
 * @param {boolean} itsAnUpdate
 *
 * @return {Promise<void>}
 */
const submitForm = async (itsAnUpdate = false) => {
	let custom_name = document.getElementById('custom_name').value.trim();
	let species = document.getElementById('species').value.trim();
	let location = document.getElementById('location').value.trim();
	let planting_date = document.getElementById('planting_date').value;

	if (!custom_name || !location || !planting_date) {
		alert('Os campos "Nome Personalizado", "Localização" e "Data de Plantio" são obrigatórios!');
		return;
	}

	if (itsAnUpdate) {
		if (editingId == null) {
			alert('Nenhuma árvore selecionada para atualização.');
			return;
		}
		await updateTree(custom_name, species, location, planting_date, editingId);
		cancelEditOperation(); // Limpa o formulário e altera o estado inicial da variável "editingId"
		refreshList();
	} else {
		await createTree(custom_name, species, location, planting_date);
		refreshList();
	}
};

/**
 * @description Função para inserir os dados das árvores dentro do HTML
 *
 * @param {string} custom_name
 * @param {string} species
 * @param {string} location
 * @param {string} planting_date
 * @param {string} id
 *
 * @return {void}
 */
const insertList = (custom_name, species, location, planting_date, id) => {
	const list = document.getElementById('myTreesList');
	const li = document.createElement('li');
	li.classList.add('list-item');
	const formattedDate = new Date(`${planting_date}T00:00:00`).toLocaleDateString('pt-BR');

	li.innerHTML = `
	<div class="informations">
		<p class="main-info">${custom_name}</p>
		<p class="sub-info">🔬 ${species ? species : '---'}</p>
		<p class="sub-info">📌 ${location}</p>
		<p class="sub-info">🗓️ Semeado(a) em: ${formattedDate}</p>
	</div>
	<div class="btn-actions">
		<div class="btn-container">
			<svg
				class="btn-update"
				alt="ícone de edição"
				viewBox="0 0 494.936 494.936"
				xml:space="preserve">
				<g>
					<path d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157
						c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21
						s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741
						c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"/>
					<path d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069
						c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963
						c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692
						C494.936,37.396,491.007,27.915,483.876,20.791z M466.61,56.897L257.457,266.05c-0.035,0.036-0.055,0.078-0.089,0.107
						l-33.989,15.131L238.51,247.3c0.03-0.036,0.071-0.055,0.107-0.09L447.765,38.058c5.038-5.039,13.819-5.033,18.846,0.005
						c2.518,2.51,3.905,5.855,3.905,9.414C470.516,51.036,469.127,54.38,466.61,56.897z"/>
				</g>
			</svg>
		</div>
		<div class="btn-container">
			<svg
				class="btn-delete"
				alt="ícone de exclusão"
				viewBox="0 0 482.428 482.429"
				xml:space="preserve">
				<g>
					<path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
						c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
						h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
						C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
						C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
						c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
						c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
						V115.744z"/>
					<path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
						c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"/>
					<path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
						c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"/>
					<path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
						c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"/>
				</g>
			</svg>
		</div>
	</div>
    `;

	list.appendChild(li);

	li.querySelector('.btn-update').addEventListener('click', () => {
		editingId = id; // Armazena temporariamente o id da árvore a ser editada
		fillFormFields({ custom_name, species, location, planting_date });
		document.getElementById('submitButton').classList.add('hidden');
		document.getElementById('updateButton').classList.remove('hidden');
	});

	li.querySelector('.btn-delete').addEventListener('click', async () => {
		if (confirm('Você confirma a remoção dessa árvore?')) {
			await deleteTree(id);
			refreshList();
		}
	});

	document.getElementById('treeInformations').reset();
};

/**
 * @description Função para atualizar a lista de árvores registradas no banco de dados
 *
 * @return {void}
 */
const refreshList = async () => {
	document.getElementById('myTreesList').innerHTML = ''; // Limpa a lista para recarregar os dados atualizados
	await getTrees(); // Recarrega a lista com os dados atualizados
};

/**
 * @description Função para preencher o formulário com os dados da árvore a ser editada
 *
 * @param {object} tree
 * @param {string} tree.custom_name
 * @param {string} tree.species
 * @param {string} tree.location
 * @param {string} tree.planting_date
 *
 * @return {void}
 */
const fillFormFields = ({ custom_name, species, location, planting_date }) => {
	document.getElementById('custom_name').value = custom_name || '';
	document.getElementById('species').value = species || '';
	document.getElementById('location').value = location || '';
	document.getElementById('planting_date').value = planting_date || '';
};

/**
 * @description Função para cancelar a operação de edição e limpar o formulário
 *
 * @return {void}
 */
const cancelEditOperation = () => {
	document.getElementById('treeInformations').reset();
	document.getElementById('updateButton').classList.add('hidden');
	document.getElementById('submitButton').classList.remove('hidden');
	editingId = null; // Limpa o ID que seria editado quando a operação é cancelada
};

const form = document.getElementById('treeInformations');
const submitButton = document.getElementById('submitButton');
const updateButton = document.getElementById('updateButton');
const resetButton = document.getElementById('resetButton');

form.addEventListener('submit', (event) => {
	event.preventDefault();
	submitForm(false);
});

form.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') event.preventDefault();
});

submitButton.addEventListener('click', (event) => {
	event.preventDefault();
	submitForm(false);
});

updateButton.addEventListener('click', (event) => {
	event.preventDefault();
	submitForm(true);
});

resetButton.addEventListener('click', (event) => {
	event.preventDefault();
	cancelEditOperation();
});

getTrees(); // Chamada de função para carregar as árvores já cadastradas no servidor
