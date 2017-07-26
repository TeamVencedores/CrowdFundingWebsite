const { Router } = require('express');

// const items = [{
//     id: 1,
//     name: 'Cuki',
// }];

const attachRoutes = (app, data) => {
    const router = new Router();

    router
        .get('/:id', (req, res) => {
            const id = parseInt(req.params.id, 10);
            const item = data.items.find((i) => i.id === id);
            if (!item) {
                return res.status(404)
                    .send({
                        error: 'Not found',
                    });
            }
            return res.send(item);
        })
        .get('/', (req, res) => {
            let { category, filter } = req.query;
            category = category || {};
            filter = filter || {};
            // TODO add filter by newest, popular, most funded
            console.log(category);
            data.projects.getAll({ category: category.toLowerCase() })
                .then((projects) => {
                    console.log(projects);
                    res.render('items/projects', { model: projects }, (err, html) => {
                        res.send(html);
                    });
                })
                .catch((err) => {
                    console.log('--- ERROR --- ' + err);
                });
        })
        // Pagination
        // .get('/', (req, res) => {
        //     let { q, page, size } = req.query;
        //     page = parseInt(page, 10) || 1;
        //     size = parseInt(size, 10) || 10;

    //     let result = data.items;
    //     if (q) {
    //         q = q.toLowerCase();
    //         result = data.items.filter((item) => {
    //             return item.name.toLocaleLowerCase().includes(q);
    //         });
    //     }
    //     result = result.slice((page - 1) * size, page * size);
    //     res.send(result);
    // })
    // test with Postaman
    .post('/', (req, res) => {
        const item = req.body;
        item.id = data.items.length + 1;
        // hash password
        data.items.push(item);
        res.status(201)
            .send(item);
    });

    app.use('/api/items', router);
};

module.exports = attachRoutes;
