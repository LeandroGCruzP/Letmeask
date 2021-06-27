
# Letmeask

Projeto feito na semana do NLW versão 6 #Together. O objetivo é criar uma página onde algum criador de conteudo possa administrar as perguntas feitas pelo seus seguidores, onde possam curtir as perguntas dos outros e o administrador possa destacar as perguntas e marcalas como respondidas. Tudo isto será em tempo real para todos os usuarios que poderam interatuar fazendo login com a sua conta do Google.


## Link para página Letmeask

https://letmeask-7ca85.web.app/

  
## Tecnologías 

**Cliente:** React (com TypeScript)

**Servidor:** Firebase (Hosting e Realtime Database )

  
## Corre o projeto localmente

Clona o projeto

```bash
  git clone https://github.com/LeandroGCruzP/Letmeask.git
```

Vai até o projeto em teu computador (ex: powershell)

```bash
  cd /letmeask
```

Instala as dependencias

```bash
  npm install 
```
ou
```bash
  yarn
```

Corre o projeto 

```bash
  npm run start
```
ou
```bash
  yarn start
```

  
## Para seu funcionamento deve declarar as variaveis de conexão

Na raíz do projeto você deve criar um arquivo chamado .env.local e colocar as keys que o firebase te entrega. Para isso crie uma conta no firebase console (com a conta Google) e cria um projeto chamado letmeask e a key deve colocar no seguinte formato.

# Firebase

`REACT_APP_API_KEY="key"`
`REACT_APP_AUTH_DOMAIN="key"`
`REACT_APP_DATABASE_URL="key"`
`REACT_APP_PROJECT_ID="key"`
`REACT_APP_STORAGE_BUCKET="key"`
`REACT_APP_MESSAGING_SENDER_ID="key"`
`REACT_APP_APP_ID="key"`
