// Cria e insere o formulário de login
document.querySelector('#order-btn2').addEventListener('click', () => {
    // Criação do form de login 
    const login = document.createElement('form');
    login.id = 'loginForm';

    const title = document.createElement('h2');
    title.className = 'title';
    title.textContent = 'Login';
    login.appendChild(title);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.id = 'email';
    emailInput.placeholder = 'Digite o seu email';
    emailInput.required = true;
    login.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.name = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Digite a sua senha';
    passwordInput.required = true;
    login.appendChild(passwordInput);

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Iniciar sessão';
    submitButton.className = 'submit';
    login.appendChild(submitButton);

    const forgotCredentialsLink = document.createElement('a');
    forgotCredentialsLink.href = '#';
    forgotCredentialsLink.className = 'credencias';
    forgotCredentialsLink.textContent = 'Recuperar credenciais';
    login.appendChild(forgotCredentialsLink);

    document.body.appendChild(login);

    // Envio do formulário de login
    login.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Sanitização básica
        const safeEmail = data.email.trim().replace(/[<>]/g, '');
        const safePassword = data.password.trim().replace(/[<>]/g, '');

        if (safeEmail === 'dp4144@gmail.com' && safePassword === '123') {
            console.log('Login bem-sucedido', safeEmail);
            login.remove();
        } else {
            alert('Email ou senha incorretos.');
            return;
        }

        // Criação do botão para carregar livro
        const button = document.getElementById('botoes');
        button.innerHTML += '<input type="button" value="Carregar livro" id="order-btn3">';

        // Formulário para upload de livro
        document.querySelector('#order-btn3').addEventListener('click', () => {
            const bookForm = document.createElement('form');
            bookForm.id = 'bookForm';
            bookForm.setAttribute('method', 'POST');
            bookForm.setAttribute('enctype', 'multipart/form-data');
            bookForm.innerHTML = `
                <h2 class="title">Envio de Livro</h2>
                <input type="text" id="title" name="title" placeholder="Digite o título do livro" required>
                <input type="text" id="author" name="author" placeholder="Digite o nome do autor" required>
                <div>
                    <label for="category">Categoria:</label>
                    <select id="category" name="category" required>
                        <option value="">Selecione...</option>
                        <option value="ficcao">Ficção</option>
                        <option value="romance">Romance</option>
                        <option value="educacao">Educação</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                <textarea id="description" name="description" rows="5" placeholder="Descreva brevemente o livro..." required></textarea>
                <div>
                    <label for="file">Arquivo PDF:</label>
                    <input type="file" id="file" name="file" accept="application/pdf" required>
                </div>
                <input type="submit" value="Publicar" class="submit">
            `;
            document.body.appendChild(bookForm);

            // Envio do formulário de livro
            bookForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const formData = new FormData(event.target);

                axios.post('http://localhost:3000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 60000 * 2, // Timeout de 60 segundos
                })
                .then(response => {
                    console.log('Upload bem-sucedido', response);
                    alert('📚 Livro enviado com sucesso!');
                    bookForm.remove();  // Remove o formulário após sucesso
                })
                .catch(error => {
                    console.error('Erro no upload', error);
                    alert('❌ Erro ao enviar livro! Verifique se o servidor está rodando.');
                });
            }, { once: true });

        }, { once: true });
    }, { once: true });
}, { once: true });
