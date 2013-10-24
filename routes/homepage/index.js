var DBManager = require(app.get('dirname') + '/routes/modules/project-db-manager.js');

app.get('/', function(req, res) {
	res.sendfile(app.get('dirname') + '/views/home.html');
});

app.get('/projects', DBManager.loadProjects);

app.post('/projects', DBManager.addNewProject);

app.get('/ideas', DBManager.loadIdeas);

app.put('/ideas/:id',DBManager.updateIdea);

app.post('/ideas', DBManager.addNewIdea);

app.delete('/ideas/:id',DBManager.deleteIdea);

app.get('/technologies', DBManager.loadTechnologies);

