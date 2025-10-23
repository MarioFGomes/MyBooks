## 📚 Livraria Virtual — Fastify + Prisma + Frontend Moderno

Uma aplicação web completa para gestão de livros digitais (eBooks), onde é possível visualizar, fazer download, carregar, editar e excluir livros em formato PDF.
O projeto utiliza Fastify (Node.js) no backend e uma interface web responsiva com HTML, CSS, JS e Axios no frontend.

# 🚀 Funcionalidades principais

Funcionalidade	Descrição

📖 Listagem de livros	Todos os livros cadastrados são exibidos com título, autor e descrição.
📥 Download de PDF	Qualquer visitante pode baixar os eBooks diretamente.
🔐 Login de administrador	Apenas o administrador pode cadastrar, editar e excluir livros.
📤 Upload de livros	Envia e armazena novos livros (PDF) com título, autor e descrição.
✏️ Editar livros	Atualiza os dados de livros existentes (título, autor, descrição).
🗑️ Excluir livros	Remove um livro e o seu PDF associado do servidor.
💾 Persistência com Prisma	Todos os dados são guardados numa base de dados relacional (SQLite ou PostgreSQL).

# 🧩 Stack Tecnológica

Backend:

Fastify
 — servidor rápido e moderno para Node.js

Prisma ORM
 — ORM para acesso à base de dados

TypeScript
 — suporte opcional a tipagem

Multer/Fastify Multipart
 — upload de arquivos

Node.js FS
 — manipulação de ficheiros PDF

Frontend:

HTML5, CSS3 e JavaScript puro

Axios
 — comunicação assíncrona com o backend

Interface limpa e responsiva

Animações suaves (fade-in / fade-out)

# 🛠️ Instalação e Configuração

1️⃣ Clonar o projeto
git clone https://github.com/teu-usuario/livraria-virtual.git
cd livraria-virtual

2️⃣ Instalar dependências
npm install

3️⃣ Configurar a base de dados
O projeto usa Prisma ORM.
Podes editar o arquivo .env com o tipo de BD que preferes:
DATABASE_URL="file:./dev.db"   # SQLite (padrão)

Depois roda:

npx prisma migrate dev --name init

4️⃣ Iniciar o servidor
npm run dev

O servidor estará disponível em:
👉 http://localhost:3000