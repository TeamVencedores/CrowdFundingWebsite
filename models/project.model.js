const http = require('http');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

class Project {
    get id() {
        return this._id;
    }

    static isValid(model) {
        const validity = this._checkValidity(model);
        if (!validity.bool) {
            const file = path.join('./', model.coverImg);
            fs.unlink(file);
        }
        return this._checkValidity(model);
    }

    static toViewModel(model) {
        const viewModel = new Project();
        Object.keys(model)
            .forEach((prop) => {
                viewModel[prop] = model[prop];
            });
        return viewModel;
    }

    static fromViewModel(vewModel) {
        // not implemented
    }

    static _checkValidity(model) {
        let valid = true;
        let reason = '';

        if (!this._isTitleValid(model.title)) {
            valid = false;
            reason += 'Incorrect title! The title must be be between 10 and 120 symbols (latin letters, numbers and _%.!?-).\n';
        }

        if (!this._isURLValid(model.video)) {
            valid = false;
            reason += 'Invalid YouTube vide url!\n';
        }

        if (!this._isMottoValid(model.motto)) {
            valid = false;
            reason += 'Invalid motto! The motto must be be between 10 and 170 symbols.\n';
        }

        if (!this._isDescriptionValid(model.description)) {
            valid = false;
            reason += 'Invalid description! The project description must be be between 300 and 1,000 symbols.\n';
        }

        if (!this._isAmountValid(model.amount)) {
            valid = false;
            reason += 'Invalid amount! The project amount must be be between $1,000 and $1,000,000.\n';
        }

        if (!this._isDateValid(model.ending)) {
            valid = false;
            reason += 'Invalid ending date! The date cannot be in the past.\n';
        }

        return { bool: valid, reason: reason };
    }

    static _isTitleValid(title) {
        return /^[A-Za-z0-9 _%.!?-]{10,120}$/g.test(title);
    }

    static _isURLValid(url) {
        const youtubeID = url.substring(url.lastIndexOf('=') + 1, url.length);
        const options = {
            method: 'HEAD',
            host: 'img.youtube.com',
            path: '/vi/' + youtubeID + '/0.jpg',
        };

        const req = http.request(options, (res) => {
            return res.statusCode === 200;
        });

        req.end();
        return req;
    }

    static _isMottoValid(motto) {
        return motto.length > 10 && motto.length < 170;
    }

    static _isDescriptionValid(description) {
        return description.length > 300 && description.length < 1000;
    }

    static _isAmountValid(amount) {
        amount = parseInt(amount, 10);
        return amount > 1000 && amount < 1000000;
    }

    static _isDateValid(date) {
        return moment(date).isValid() && moment().diff(date, 'days') <= 0;
    }
}

module.exports = Project;
