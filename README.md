# [ctmaster.vercel.app](https://ctmaster.vercel.app)


Saudações, somos do Centro de Treinamento de Jiu-Jitsu Masters, localizado na cidade de Rio Grande do Piauí, na praça central. Nossa escola tem como objetivo ensinar os alunos não apenas no âmbito esportivo, mas também a formá-los como cidadãos de bem e crianças disciplinadas. O jiu-jitsu não apenas contribui para a defesa pessoal, mas também melhora o rendimento escolar dos praticantes.
<br>
Além disso, buscamos ampliar o acesso ao jiu-jitsu para o maior número possível de crianças e adolescentes, incluindo aqueles que se encontram em situação de vulnerabilidade e não têm condições financeiras para arcar com as aulas. Nosso compromisso é promover a inclusão social através do esporte.

## Instalar e rodar o projeto
Para instalar e rodar o CtMaster é um passo extremamente simples

### dependencias globais

- Node LTS V20

### Dependecias locais
Com o repositório clonado e as dependências globais instaladas, você pode instalar as 
dependências locais do projeto:

```
npm install
ou
npm i
```

### Rodar o Projeto

```
npm start
```

Isto irá automaticamente rodar serviços como Banco de dados, Servidor de Email e irá expor um Serviço Web (Frontend e API) no seguinte endereço:

```
http://localhost:3000/
http://localhost:3000/api/v1/status
```

Observações:

- Para derrubar todos os serviços, basta utilizar as teclas CTRL+C, que é o padrão dos terminais para matar processos.
- Você pode conferir o endereço dos outros serviços dentro do arquivo .env encontrado na raiz do projeto, como por exemplo o endereço e credenciais do Banco de Dados local ou o Frontend do Serviço de Email.

### Cadastro e login de usuarios

No ambiente de desenvolvimento você poderá tanto criar usuários manualmente (inclusive para receber e testar o email de ativação), quanto utilizar usuários pré-cadastrados e que já foram ativados para sua conveniência.

### Criar usuário manualmente

  1. Após subir os serviços, acesse [http://localhost:3000/cadastro](http://localhost:3000/cadastro)
  2. Preencha os dados e utilize qualquer email com formato válido, mesmo que este email não exista, por exemplo: ``teste@teste.com``
  3. Com o email válido, realize o login [http://localhost:3000/login](http://localhost:3000/login)

