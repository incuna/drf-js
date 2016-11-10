import 'whatwg-fetch';

export const http = {
    baseSettings: {
        credentials: 'same-origin'
    },
    getHtml: function (url) {
        return fetch(url, this.baseSettings)
            .then((response) => response.text());
    },
    getJSON: function (url) {
        return fetch(url, this.baseSettings)
            .then((response) => response.json());
    },

    post: function (url, body) {
        const checkStatus = function (response) {
            if (response.status >= 400) {
                return Promise.reject(response);
            }

            return Promise.resolve(response);
        };

        const headers = new Headers({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        });

        const options = Object.assign({
            method: 'POST',
            body,
            headers
        }, this.baseSettings);

        console.log(url, options);
        return fetch(url, options)
            .then(checkStatus);
    },

    getCsrfToken: function () {
        const csrfCookieRegex = /.*csrftoken=(\w+).*/;
        const csrfToken = document.cookie.match(csrfCookieRegex)[1];

        return csrfToken;
    },

    postDataAsForm: function (url, data) {
        const formData = new FormData();

        formData.append('csrfmiddlewaretoken', this.getCsrfToken());

        for (const key in data) {
            formData.append(key, data[key]);
        }

        return this.post(url, formData);
    },

    postForm: function (url, form) {
        const formData = new FormData(form);

        return this.post(url, formData);
    },

    postJSON: function (url, data) {
        return this.post(url, JSON.stringify(data));
    }
};

export default http;
