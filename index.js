const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("./todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const todoService = protoDescriptor.TodoService;

const server = new grpc.Server();

const todos = [
  { id: "1", title: "todo1", content: "content1" },
  { id: "2", title: "todo2", content: "content2" },
];

const ListTodos = (call, callback) => {
  console.log(call);
  callback(null, {
    todos: todos,
  });
};

const GetTodo = (call, callback) => {
  const todoId = call.request.id;
  const response = todos.filter((todo) => todo.id == todoId);
  if (response.length > 0) {
    callback(null, response);
  } else {
    callback({ message: "todo not found!" }, null);
  }
};

const CreateTodo = (call, callback) => {
  console.log(call);
  const newtodo = call.request;
  todos.push(newtodo);
  callback(null, newtodo);
};

server.addService(todoService.service, {
  listTodos: ListTodos,
  getTodo: GetTodo,
  createTodo: CreateTodo,
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Started the server");
    server.start();
  }
);
