'use strict';

// main tab redirects
page('/', app.nameController.open);
page('/info', app.infoController.open);
page('/projects', app.projectsController.open, app.projectsController.loadAll, app.projectsController.init);

// filter projects redirects
page('/projects/:language', app.projectsController.open, app.projectsController.loadLang, app.projectsController.init);

page();
