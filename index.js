const express = require('express');

const server = express();

server.use(express.json());

let countMethods = 0;

//Global middleware for req number counter 
server.use((req, res, next) => {
    if (req.method) {
        countMethods = countMethods + 1;
    }
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    console.log(`Total de requisições até o momento: ${countMethods}`);

    return next();
});

const projects = [
    {
        "id": "1",
        "title": 'Módulo01',
        "tasks": ['NodeJS', 'Express', 'Nodemon']
    },
];

//Middleware for check if exists project with id
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id === id);
    if (!project) {
        return res.status(400).json({ error: 'Project does not exists' });
    }
    req.project = project;
    return next();
}

//List all projects
server.get('/projects', (req, res) => {
    return res.send(projects);
});

//List project for id
server.get('/projects/:id', checkProjectExists, (req, res) => {
    //const { id } = req.params;
    //const project = projects.find(p => p.id === id);

    return res.json(req.project);
});

//Create a new project
server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;
    const project = { id, title, tasks }

    projects.push(project);

    return res.json(projects);
});

//Modifiy name project
server.put('/projects/:id', checkProjectExists, (req, res) => {
    //const { id } = req.params;
    //const project = projects.find(p => p.id === id);
    const { title } = req.body;
    req.project.title = title;

    return res.json(req.project);
});

//Add new tasks in exists project
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    //const { id } = req.params;
    //const project = projects.find(p => p.id == id);
    const { title } = req.body;
    req.project.tasks.push(title);

    return res.json(req.project);
});

//Delete exists project
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const projectIndex = projects.findIndex(p => p.id == id);
    projects.splice(projectIndex, 1);

    return res.send({ message: "Projeto deletado com sucesso!" });
});

server.listen(3000);