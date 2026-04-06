# 🧾 Controlorça — Gerador de Orçamentos Profissionais

> Plataforma web full-stack para criação, gestão e exportação de orçamentos em PDF, com autenticação, banco de dados em nuvem e modelo freemium integrado ao Stripe.

🔗 **Acesse ao vivo:** [controle-orcamento-site.vercel.app](https://controle-orcamento-site.vercel.app)

---

## ✨ Funcionalidades

- 📝 **Criação de orçamentos** com dados da empresa, cliente e itens detalhados (nome, quantidade, valor unitário)
- 💾 **Dashboard completo** para listar, editar e excluir orçamentos salvos em nuvem
- 📄 **Exportação em PDF profissional** gerado no front-end com html2canvas + jsPDF
- 🔐 **Autenticação segura** via Supabase Auth (cadastro, login e rotas protegidas)
- 💳 **Plano Premium** com checkout via Stripe (BRL) — remove marca d'água dos PDFs
- 📊 **Histórico de orçamentos** acessível a qualquer momento, com ordenação por data
- 📱 **Interface responsiva** — funciona perfeitamente em desktop e mobile
- ☁️ **Backend serverless** com Supabase Edge Functions (Deno) para lógica de pagamento

---

## 🛠️ Tecnologias Utilizadas

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

| Categoria | Tecnologia |
|---|---|
| **Front-end** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Back-end** | Supabase (PostgreSQL + Auth + Edge Functions) |
| **Pagamentos** | Stripe Checkout (assinatura em BRL) |
| **PDF** | html2canvas + jsPDF |
| **Deploy** | Vercel (CI/CD automático) |
| **Runtime serverless** | Deno (Supabase Edge Functions) |

---

## 🚀 Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+ ou [Bun](https://bun.sh/)
- Conta gratuita no [Supabase](https://supabase.com/) com projeto criado
- (Opcional) Conta no [Stripe](https://stripe.com/) para testar pagamentos

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Zhennyn/controle-orcamento-site.git
   cd controle-orcamento-site
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   bun install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:
   ```env
   VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   bun run dev
   ```

5. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

---

## 📸 Screenshots

> As capturas abaixo mostram as principais telas da plataforma Controlorça.

| Página Inicial | Dashboard | Orçamento em PDF |
|---|---|---|
| Tela de boas-vindas com hero section e CTA | Lista de orçamentos com gestão completa | Visualização do orçamento exportado em PDF |

> 💡 *Acesse a demo ao vivo para ver a aplicação em funcionamento.*

---

## 🌐 Demonstração

🔗 **Deploy em produção:** [https://controle-orcamento-site.vercel.app](https://controle-orcamento-site.vercel.app)

A aplicação está publicada na Vercel com deploy contínuo a partir da branch `main`. Qualquer push aciona automaticamente o pipeline de build e deploy.

---

## 📌 Sobre o projeto

O **Controlorça** é uma aplicação web full-stack desenvolvida em **2024/2025** com o objetivo de resolver um problema real: profissionais autônomos e pequenas empresas precisam emitir orçamentos de forma rápida, organizada e visualmente profissional.

### Por que este projeto demonstra habilidades relevantes para TI?

| Habilidade | Como aparece no projeto |
|---|---|
| ☁️ **Cloud & BaaS** | Supabase hospedado na nuvem com banco PostgreSQL gerenciado |
| 🔐 **Autenticação & Segurança** | Auth com JWT, rotas protegidas, Row Level Security no banco |
| 🗄️ **Banco de Dados** | Modelagem relacional (`budgets` → `budget_items`), queries via SDK |
| ⚙️ **Automação / Serverless** | Edge Functions em Deno para integração com Stripe sem expor secrets |
| 🖥️ **Full-Stack** | Front-end React + TypeScript + API REST via Supabase |
| 📊 **Geração de relatórios** | Exportação de dados em PDF formatado programaticamente |
| 🚀 **DevOps básico** | Deploy automático na Vercel, variáveis de ambiente, CI/CD |
| 💳 **Integração de APIs externas** | Stripe Checkout com webhooks e gerenciamento de assinaturas |

Este projeto reflete o perfil de um desenvolvedor que transita com confiança entre front-end, back-end, banco de dados e cloud — competências valorizadas em vagas de **Suporte TI N2/N3, Analista de Dados, Desenvolvedor Full-Stack e Cloud**.

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Se você tiver sugestões, encontrar bugs ou quiser adicionar funcionalidades:

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

Feito com ❤️ por [Zhennyn](https://github.com/Zhennyn)
