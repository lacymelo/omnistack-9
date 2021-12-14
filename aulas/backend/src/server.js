const express = require('express');
const { createServer } = require('http');
const { Server} = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const routes = require('./routes');

// criando servidor
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


//conexão com o banco de dados
mongoose.connect('mongodb+srv://dev9:dev9@cluster0.tbeyr.mongodb.net/dev9?retryWrites=true&w=majority', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const connectedUsers = {}

io.on("connection", (socket) => { 
   //id do usuário
   const { user_id } = socket.handshake.query;

   connectedUsers[user_id] = socket.id; //id de conexão
});

app.use((req, res, next) => {
   req.io = io;
   req.connectedUsers = connectedUsers;

   return next();
});

//permissões do cors
app.use(cors({
   origin: '*',
   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
   preflightContinue: false,
   optionsSuccessStatus: 200
}));

//para requisições do tipo json
app.use(express.json());

//para acessar arquivos estáticos salvos no projeto
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

//acessando as rotas
app.use(routes);

//porta de execução da aplicação
httpServer.listen(3333);