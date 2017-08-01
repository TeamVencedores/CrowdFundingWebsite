const bcrypt = require('bcryptjs');

const init = (data) => {
    const controller = {
        postRegister(req, res) {
            const bodyUser = req.body;
            bodyUser.username = bodyUser.username.trim();
            bodyUser.password = bodyUser.password.trim();
            const initialAmount = parseInt(bodyUser.amount.trim(), 10);
            bodyUser.amount = initialAmount;

            if (bodyUser.username === '') {
                req.flash('error', 'Enter username please');
                return res.redirect('/auth/register');
            } else if (bodyUser.password === '') {
                req.flash('error', 'Enter password please');
                return res.redirect('/auth/register');
            } else if (isNaN(initialAmount) || initialAmount < 0) {
                req.flash('error', 'Amount should be between 0 and 10 000!');
                return res.redirect('/auth/register');
            }

            return data.users.findByUsername(bodyUser.username)
                .then((user) => {
                    // console.log('===0===');
                    // console.log(user);
                    if (user) {
                        req.flash('error', 'There is user with this username!');
                        res.redirect('/auth/register');
                        return Promise.reject(res);
                    }
                    // console.log('===1===');
                    bodyUser.password = bcrypt.hashSync(bodyUser.password, 10);
                    return data.users.create(bodyUser);
                })
                .then((insertedUser) => {
                    // console.log('===2===');
                    req.login(insertedUser, (err) => {
                        if (err) {
                            res.redirect('/auth/register');
                        }
                        return res.redirect('/');
                    });
                })
                .catch((err) => {
                    // console.log(err);
                });
        },
        getProfile(req, res) {
            const username = req.user.username.trim();
            const favs = data.users.getFavouriteProjects(username);
            const myPrjcts = data.projects.getAll({ 'username': username });

            Promise.all([myPrjcts, favs])
                .then((values) => {
                    const favsRefs = values[1][0].favourites || [];

                    data.projects.getAll({ ref: { $in: favsRefs } })
                        .then((result) => {
                            res.render('users/profile', {
                                myProjects: values[0],
                                favouriteProjects: result,
                            });
                        });
                });
        },
        postFavorites(req, res) {
            const username = res.locals.user.username.trim();
            const favs = [req.body.favourites];

            data.users.addFavourites(username, favs)
                .then((result) => {
                    if (!result.result.ok) {
                        req.flash('error', 'Failed to add to favourites..');
                    } else {
                        req.flash('info', 'Succesfuly added to favourites!');
                    }
                    res.locals.messages = req.flash();
                    return data.projects.addUserToLiked(favs[0], username);
                }).then(() => {
                    return res.render('flash_message_template');
                })
                .catch(() => {
                    req.flash('error', 'Something happened');
                    res.locals.messages = req.flash();
                    return res.render('flash_message_template');
                });
        },
        deleteFavorites(req, res) {
            const username = res.locals.user.username.trim();
            const favs = [req.body.favourites];

            data.users.removeFavourites(username, favs)
                .then((result) => {
                    if (!result.result.ok) {
                        req.flash('error', 'Failed to remove from favourites..');
                    } else {
                        req.flash('info', 'Succesfuly removed from favourites!');
                    }
                    return data.projects.removeUserFromLikes(favs[0], username);
                }).then(() => {
                    res.locals.messages = req.flash();
                    return res.render('flash_message_template');
                })
                .catch(() => {
                    req.flash('error', 'Something happened');
                    res.locals.messages = req.flash();
                    return res.render('flash_message_template');
                });
        },
    };

    return controller;
};

module.exports = { init };