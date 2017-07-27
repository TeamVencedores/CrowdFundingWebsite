const { Router } = require('express');

const attachRoutes = (app, data) => {
    const router = new Router();

    router
        .get('/', (req, res) => {
            res.render('projects/projectsAll');
        })
        // form can be shown dynamically 
        // as modal window with javascript - api.router?
        // TODO delete
        // .get('/form', (req, res) => {
        //     return res.render('projects/form');
        // })
        .get('/newproject', (req, res) => {
            return res.render('projects/newproject');
        })
        .get('/project', (req, res) => {
            return res.render('projects/project');
        })
        .get('/:id', (req, res) => {
            const id = parseInt(req.params.id, 10);
            data.projects.getAll({ id: id })
                .then((projects) => {
                    if (!projects) {
                        // here we can use redirect
                        // because we're not doing ajax
                        console.log('----- WRONG ID -----');
                        return res.redirect('/404');
                    }
                    return res.render('projects/project', {
                        model: projects[0],
                    });
                })
                .catch((err) => {
                    req.flash('error', err);
                });
        })
        .post('/', (req, res) => {
            const project = req.body;
            console.log(project);
            // create method is in base.data.js
            data.projects.create(project);
            return res
                .status(201)
                .redirect('/projects');
        });

    app.use('/projects', router);
};

module.exports = attachRoutes;
