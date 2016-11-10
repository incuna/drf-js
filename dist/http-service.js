'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.http = undefined;

require('whatwg-fetch');

var http = exports.http = {
    baseSettings: {
        credentials: 'same-origin'
    },
    getHtml: function getHtml(url) {
        return fetch(url, this.baseSettings).then(function (response) {
            return response.text();
        });
    },
    getJSON: function getJSON(url) {
        return fetch(url, this.baseSettings).then(function (response) {
            return response.json();
        });
    },

    post: function post(url, body) {
        var checkStatus = function checkStatus(response) {
            if (response.status >= 400) {
                return Promise.reject(response);
            }

            return Promise.resolve(response);
        };

        var headers = new Headers({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        });

        var options = Object.assign({
            method: 'POST',
            body: body,
            headers: headers
        }, this.baseSettings);

        console.log(url, options);
        return fetch(url, options).then(checkStatus);
    },

    getCsrfToken: function getCsrfToken() {
        var csrfCookieRegex = /.*csrftoken=(\w+).*/;
        var csrfToken = document.cookie.match(csrfCookieRegex)[1];

        return csrfToken;
    },

    postDataAsForm: function postDataAsForm(url, data) {
        var formData = new FormData();

        formData.append('csrfmiddlewaretoken', this.getCsrfToken());

        for (var key in data) {
            formData.append(key, data[key]);
        }

        return this.post(url, formData);
    },

    postForm: function postForm(url, form) {
        var formData = new FormData(form);

        return this.post(url, formData);
    },

    postJSON: function postJSON(url, data) {
        return this.post(url, JSON.stringify(data));
    }
};

exports.default = http;