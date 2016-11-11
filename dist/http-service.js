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
    getRaw: function getRaw(url) {
        return fetch(url, this.baseSettings).then(function (response) {
            return response.text();
        });
    },
    getJSON: function getJSON(url) {
        return fetch(url, this.baseSettings).then(function (response) {
            return response.json();
        });
    },

    post: function post(url, body, extraHeaders) {
        var checkStatus = function checkStatus(response) {
            if (response.status >= 400) {
                return Promise.reject(response);
            }

            return Promise.resolve(response);
        };

        var plainHeaders = {
            'X-Requested-With': 'XMLHttpRequest'
        };

        if (extraHeaders) {
            Object.assign(plainHeaders, extraHeaders);
        }

        var headers = new Headers(plainHeaders);

        var options = Object.assign({
            method: 'POST',
            body: body,
            headers: headers
        }, this.baseSettings);

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

    postForm: function postForm(url, formElement) {
        var formData = new FormData(formElement);

        return this.post(url, formData);
    },

    postJSON: function postJSON(url, data) {
        var headers = {
            'Content-Type': 'application/json'
        };
        return this.post(url, JSON.stringify(data), headers);
    }
};

exports.default = http;