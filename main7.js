const express = require('express');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    let { name } = req.query;
    fs.readdir('page', (err, files) => {
        let list = template.list(files);
        fs.readFile(`page/${name}`, 'utf-8', (err, data) => {
            let control = `<a href="/create"><button type='submit'>CREATE</button></a><br><a href="/update?name=${name}"><button type='submit'>UPDATE</button></a>
            <br><form action="delete_process" method="post">
            <input type='hidden' name='id' value='${name}'>
            <button type='submit'>DELETE</button>
        </form>
            `;
            if (name === undefined) {
                name = 'WELCOME';
                data = '환영합니다!<br>나만의 일기를 써보고 사람들과 공유해보세요.';
                control = `<a href="/create"><button type='submit'>CREATE</button></a>`;
            }
            const html = template.main(name, list, `<h2>${name}</h2><p>${data}</p>`, control);

            res.send(html);
        });
    });
});

app.get('/create', (req, res) => {
    fs.readdir('page', (err, files) => {
        const name = 'create';
        const list = template.list(files);
        const data = template.create();
        const html = template.main(name, list, data, '');
        res.send(html);
    });
});

app.post('/create_process', (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body = body + data;
    });
    req.on('end', () => {
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;

        fs.writeFile(`page/${title}`, description, 'utf-8', (err) => {
            res.redirect(302, `/?name=${title}`);
        });
    });
});

app.get('/update', (req, res) => {
    let { name } = req.query;
    fs.readdir('page', (err, files) => {
        let list = template.list(files);
        fs.readFile(`page/${name}`, 'utf-8', (err, content) => {
            let control = `<a href="/create"><button type='submit'>CREATE</button></a><br><a href="/update?name=${name}"><button type='submit'>UPDATE</button></a>
            <br><form action="delete_process" method="post">
            <input type='hidden' name='id' value='${name}'>
            <button type='submit'>DELETE</button>
        </form>
            `;
            const data = template.update(name, content);
            const html = template.main(name, list, `<h2>${name}</h2><p>${data}</p>`, control);
            res.send(html);
        });
    });
});

app.post('/update_process', (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body = body + data;
    });
    req.on('end', () => {
        const post = qs.parse(body);
        const id = post.id;
        const title = post.title;
        const description = post.description;

        fs.rename(`page/${id}`, `page/${title}`, (err) => {
            fs.writeFile(`page/${title}`, description, 'utf-8', (err) => {
                res.redirect(302, `/?name=${title}`);
            });
        });
    });
});

app.post('/delete_process', (req, res) => {
    let body = '';
    req.on('data', (data) => {
        body = body + data;
    });
    req.on('end', () => {
        const post = qs.parse(body);
        const id = post.id;

        fs.unlink(`page/${id}`, (err) => {
            res.redirect(302, '/');
        });
    });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});