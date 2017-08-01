const webdriver = require('selenium-webdriver');

let driver = null;

const waitSeconds = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
};

const waitFor = (selector) => {
    try {
        return driver.findElement(
            webdriver.By.css(selector)
        )
            .catch((err) => {
                return waitFor(selector);
            });
    } catch (err) {
        return waitSeconds(1)
            .then(() => waitFor(selector));
    }
};

const waitForMany = (selector) => {
    try {
        return driver.findElements(
            webdriver.By.css(selector)
        )
            .catch((err) => {
                return waitForMany(selector);
            });
    } catch (err) {
        return waitSeconds(1)
            .then(() => waitForMany(selector));
    }
};

const getText = (selector) => {
    return Promise.resolve()
        .then(() => waitFor(selector))
        .then((element) => element.getText());
};

const getTexts = (selector) => {
    return Promise.resolve()
        .then(() => waitForMany(selector))
        .then((elements) => {
            return Promise.all(
                elements.map((el) => el.getText())
            );
        });
};

const getElement = (selector) => {
    return Promise.resolve()
        .then(() => waitFor(selector));
};

const getElements = (selector) => {
    return Promise.resolve()
        .then(() => waitForMany(selector))
        .then((elements) => {
            return Promise.all(elements);
        });
};

const getSelected = (selector) => {
    return Promise.resolve()
        .then(() => waitFor(selector))
        .then((el) => el.isSelected());
};

const setValue = (selector, value) => {
    return Promise.resolve()
        .then(() => waitFor(selector))
        .then((el) => el.sendKeys(value));
};

const click = (selector) => {
    return Promise.resolve()
        .then(() => waitFor(selector))
        .then((el) => el.click());
};

module.exports = {
    setDriver(_driver) {
        driver = _driver;
    },
    waitFor, getText, getTexts, getElements,
    getElement, getSelected, setValue, click, waitSeconds,
};
