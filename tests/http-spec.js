import { http } from '../src/http-service';

describe('http', function () {

    beforeEach(function () {
        this.http = http;

        this.fetchPromise = new Promise((resolve) => {
            this.promiseHelper = {
                resolve
            };
        });

        this.originalFetch = window.fetch;
        window.fetch = jasmine.createSpy('fetch');
        window.fetch.and.returnValue(this.fetchPromise);

        this.url = '/event/1/question/1/';

        this.textResponse = new Response('<div id="response">Hi</div>');

        this.responseObject = {
            data: 1
        };
        this.jsonResponse = new Response(JSON.stringify(this.responseObject));
        this.response400 = new Response('Error', {
            status: 400
        });
    });

    afterEach(function () {
        window.fetch = this.originalFetch;
    });

    describe('getRaw method', function () {

        beforeEach(function () {
            this.promiseHelper.resolve(this.textResponse);
        });

        it('should return a string promise', function (done) {
            this.http.getRaw().then((response) => {
                expect(response).toEqual(jasmine.any(String));
                done();
            });
        });

    });

    describe('getJSON method', function () {

        beforeEach(function () {
            this.promiseHelper.resolve(this.jsonResponse);
        });

        it('should return JSON', function (done) {
            this.http.getJSON().then((response) => {
                expect(response).toEqual(this.responseObject);
                done();
            });
        });
    });

    describe('postForm method', function () {

        beforeEach(function () {
            this.form = document.createElement('form');
            this.url = 'some/url';
        });

        it('should parse a given form and send the data', function () {
            this.http.postForm(this.url, this.form);

            const httpSettings = {
                method: 'POST',
                body: jasmine.any(FormData),
                headers: jasmine.any(Headers),
                credentials: 'same-origin'
            };

            expect(window.fetch).toHaveBeenCalledWith(this.url, httpSettings);

        });

        it('should error on 400 reponse', function (done) {
            this.promiseHelper.resolve(this.response400);

            this.http.postForm(this.url, this.form)
                .then(() => fail('Promise should have been rejected'))
                .catch(() => done());
        });

        it('should have the AJAX header', function () {

            this.http.postForm(this.url, this.form);

            const args = window.fetch.calls.argsFor(0);

            for (let header of args[1].headers.entries()) {
                expect(header[0]).toBe('x-requested-with');
                expect(header[1]).toBe('XMLHttpRequest');
            }
        });

    });

    describe('postDataAsForm method', function () {

        it('should parse the given data as FormData and attach the csrf cookie', function () {
            expect(window.fetch).not.toHaveBeenCalled();
            document.cookie = 'csrftoken=SECURITY11';

            const data = {
                value: 1,
                anotherValue: 'two',
                lastValue: false
            };

            const expectedData = {
                value: '1',
                anotherValue: 'two',
                lastValue: 'false',
                csrfmiddlewaretoken: 'SECURITY11'
            };

            this.http.postDataAsForm(this.url, data);

            const args = window.fetch.calls.argsFor(0);

            expect(args[0]).toBe(this.url);
            expect(args[1].method).toBe('POST');
            expect(args[1].credentials).toBe('same-origin');

            let resultObject = {};
            for (let entry of args[1].body.entries()) {
                resultObject[entry[0]] = entry[1];
            }

            expect(resultObject).toEqual(expectedData);
        });

        it('should have the right AJAX header', function () {
            this.http.postDataAsForm(this.url, {});

            const args = window.fetch.calls.argsFor(0);

            for (let header of args[1].headers.entries()) {
                expect(header[0]).toBe('x-requested-with');
                expect(header[1]).toBe('XMLHttpRequest');
            }

        });

        it('should error on 400 reponse', function (done) {
            this.promiseHelper.resolve(this.response400);

            this.http.postDataAsForm(this.url, {})
                .then(() => fail('Promise should have been rejected'))
                .catch(() => done());
        });
    });

    describe('postJSON method', function () {

        beforeEach(function () {
            this.promiseHelper.resolve(this.jsonResponse);
        });

        it('should make a fetch request', function (done) {
            const data = {
                a: 1
            };

            this.http.postJSON(this.url, data)
                .then(() => {
                    expect(fetch).toHaveBeenCalled();
                    done();
                });
        });

    });

});
