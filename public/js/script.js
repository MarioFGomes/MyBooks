// 🟠 Efeito fade-out antes de remover elemento
function fadeOutAndRemove(element) {
  element.classList.add('fade-out');
  setTimeout(() => element.remove(), 300);
}

let usuarioLogado = false; // controle de login
let tokenAdmin = null; // 🔐 armazenará o token JWT do admin

// 🟢 Função para listar livros disponíveis (antes e depois do login)
async function carregarLivrosPublicos() {
  const section = document.querySelector('.translations .translation-grid');
  if (!section) return;

  try {
    const response = await axios.get('http://localhost:3000/books');
    const books = response.data;

    section.innerHTML = ''; // limpa o conteúdo anterior

    if (!books.length) {
      section.innerHTML = `<p style="text-align:center;color:#555;">Nenhum livro disponível no momento.</p>`;
      return;
    }

    books.forEach((book) => {
      const div = document.createElement('div');
      div.className = 'translation-item fade-in';
      div.innerHTML = `
        <img src="Ebookdribbble.webp" alt="${book.title}" />
        <h3><strong>Título:</strong> ${book.title}</h3>
        <p><strong>Autor:</strong> ${book.author}</p>
        <p><strong>Descrição:</strong> ${book.description}</p>
        <a href="http://localhost:3000/document/${book.pdfPath}" class="download-btn" download>📥 Baixar PDF</a>
      `;

      // 🔹 Se o admin estiver logado, mostrar botões de ação
      if (usuarioLogado && tokenAdmin) {
        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.innerHTML = `
          <button class="edit-btn">✏️ Editar</button>
          <button class="delete-btn">🗑️ Excluir</button>
        `;

        // 🗑️ Excluir livro
        actions.querySelector('.delete-btn').addEventListener('click', async () => {
          if (confirm(`Deseja realmente excluir "${book.title}"?`)) {
            try {
              await axios.delete(`http://localhost:3000/books/${book.id}`, {
                headers: { Authorization: `Bearer ${tokenAdmin}` },
              });
              fadeOutAndRemove(div);
              alert('🗑️ Livro excluído com sucesso!');
            } catch (err) {
              console.error('Erro ao excluir livro:', err);
              alert('❌ Erro ao excluir o livro.');
            }
          }
        });

        // ✏️ Editar livro
        actions.querySelector('.edit-btn').addEventListener('click', () => abrirFormularioEdicao(book));

        div.appendChild(actions);
      }

      section.appendChild(div);
    });
  } catch (error) {
    console.error('Erro ao carregar livros:', error);
    section.innerHTML = `<p style="text-align:center;color:red;">❌ Erro ao carregar os livros. Verifique o servidor.</p>`;
  }
}

// Atualiza automaticamente ao carregar
document.addEventListener('DOMContentLoaded', carregarLivrosPublicos);

// 🟢 Formulário de upload (somente após login do admin)
function criarFormularioUpload() {
  const existing = document.getElementById('bookForm');
  if (existing) return;

  const bookForm = document.createElement('form');
  bookForm.id = 'bookForm';
  bookForm.className = 'popup fade-in';
  bookForm.setAttribute('method', 'POST');
  bookForm.setAttribute('enctype', 'multipart/form-data');

  const close = document.createElement('span');
  close.textContent = '✖';
  close.className = 'close-btn';
  close.title = 'Fechar';
  close.addEventListener('click', () => fadeOutAndRemove(bookForm));
  bookForm.appendChild(close);

  bookForm.insertAdjacentHTML(
    'beforeend',
    `
    <h2 class="title">📘 Envio de Livro</h2>
    <input type="text" name="title" placeholder="Título do livro" required>
    <input type="text" name="author" placeholder="Autor" required>
    <textarea name="description" rows="5" placeholder="Descrição breve..." required></textarea>
    <div class="input-group">
      <label for="file">Arquivo PDF:</label>
      <input type="file" name="file" accept="application/pdf" required>
    </div>
    <input type="submit" value="📤 Publicar" class="submit">
  `
  );

  document.body.appendChild(bookForm);

  // Envio do formulário
  bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(bookForm);

    try {
      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenAdmin}`, // ✅ envia token
        },
      });
      alert('📚 Livro enviado com sucesso!');
      fadeOutAndRemove(bookForm);
      carregarLivrosPublicos();
    } catch (err) {
      console.error('Erro no upload:', err);
      alert('❌ Erro ao enviar livro! Verifique se está logado como admin.');
    }
  });
}

// ✏️ Formulário de edição
function abrirFormularioEdicao(book) {
  const existing = document.getElementById('editForm');
  if (existing) return;

  const editForm = document.createElement('form');
  editForm.id = 'editForm';
  editForm.className = 'popup fade-in';

  const close = document.createElement('span');
  close.textContent = '✖';
  close.className = 'close-btn';
  close.title = 'Fechar';
  close.addEventListener('click', () => fadeOutAndRemove(editForm));
  editForm.appendChild(close);

  editForm.insertAdjacentHTML(
    'beforeend',
    `
    <h2 class="title">✏️ Editar Livro</h2>
    <input type="text" name="title" value="${book.title}" required>
    <input type="text" name="author" value="${book.author}" required>
    <textarea name="description" rows="5" required>${book.description}</textarea>
    <input type="submit" value="💾 Salvar alterações" class="submit">
  `
  );

  document.body.appendChild(editForm);

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(editForm).entries());

    try {
      await axios.put(`http://localhost:3000/books/${book.id}`, data, {
        headers: { Authorization: `Bearer ${tokenAdmin}` },
      });
      alert('✅ Livro atualizado com sucesso!');
      fadeOutAndRemove(editForm);
      carregarLivrosPublicos();
    } catch (err) {
      console.error('Erro ao atualizar livro:', err);
      alert('❌ Erro ao atualizar o livro.');
    }
  });
}

// 🟢 Login seguro (apenas administrador)
function criarFormularioLogin() {
  const existingLogin = document.getElementById('loginForm');
  if (existingLogin) return;

  const login = document.createElement('form');
  login.id = 'loginForm';
  login.className = 'popup fade-in';
  login.innerHTML = `
    <span class="close-btn" id="fecharLogin">✖</span>
    <h2 class="title">Login de Administrador</h2>
    <input type="email" name="email" placeholder="Email do admin" required>
    <input type="password" name="password" placeholder="Senha" required>
    <input type="submit" value="Iniciar sessão" class="submit">
  `;

  document.body.appendChild(login);
  document.getElementById('fecharLogin').addEventListener('click', () => fadeOutAndRemove(login));

  login.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());

    try {
      const res = await axios.post('http://localhost:3000/login', data);
      tokenAdmin = res.data.token; // 🔐 guarda token JWT
      usuarioLogado = true;

      alert('✅ Login de administrador realizado com sucesso!');
      fadeOutAndRemove(login);

      const loginBtn = document.getElementById('order-btn2');
      if (loginBtn) fadeOutAndRemove(loginBtn);

      const botoesContainer = document.getElementById('botoes');

      // 📘 Botão de upload
      const uploadBtn = document.createElement('input');
      uploadBtn.type = 'button';
      uploadBtn.value = 'Carregar livro';
      uploadBtn.id = 'order-btn3';
      botoesContainer.appendChild(uploadBtn);
      uploadBtn.addEventListener('click', criarFormularioUpload);

      // 🔴 Logout
      const logoutBtn = document.createElement('input');
      logoutBtn.type = 'button';
      logoutBtn.value = 'Terminar sessão';
      logoutBtn.id = 'logout-btn';
      botoesContainer.appendChild(logoutBtn);

      logoutBtn.addEventListener('click', () => {
        usuarioLogado = false;
        tokenAdmin = null;
        fadeOutAndRemove(uploadBtn);
        fadeOutAndRemove(logoutBtn);

        const newLoginBtn = document.createElement('input');
        newLoginBtn.type = 'button';
        newLoginBtn.value = 'Login';
        newLoginBtn.id = 'order-btn2';
        newLoginBtn.addEventListener('click', criarFormularioLogin);
        botoesContainer.appendChild(newLoginBtn);

        alert('🔒 Sessão encerrada.');
        carregarLivrosPublicos();
      });

      carregarLivrosPublicos();
    } catch (err) {
      console.error('Erro no login:', err);
      alert('❌ Email ou senha incorretos.');
    }
  });
}

// 🔹 Botão principal de login
document.querySelector('#order-btn2').addEventListener('click', criarFormularioLogin);
