module.exports = {
    main: function (name, list, body, control) {
        return `
        <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name}</title>
    </head>
    <body>
    <a href="/"><h1>일기 쓰기</h1></a>
        ${list}<br>
        ${control}<hr>
        ${body}
    </body> 
    </html>
    `;
    }, list: function(file) {
        let list = '<ul>';
        for (i = 0; i < file.length; i++) {
            list = list + `<li><a href="?name=${file[i]}">${file[i]}</a></li>`;
        }
        list = list + '</ul>';
        return list;
    }, create: function() {
        return `
        <h3>*나만의 일기를 써보세요*<h3>
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="제목"></p>
        <p><textarea name="description" placeholder="일기"></textarea></p>
        <p><button type="submit">UPLOAD</button></p>
    </form>
    `;
    }, update: function(name, content) {
        return `
        <h3>*나만의 일기를 써보세요*<h3>
        <form action="/update_process" method="post">
        <p><input type="hidden" name="id" value="${name}"></p>
        <p><input type="text" name="title" placeholder="제목" value="${name}"></p>
        <p><textarea name="description" placeholder="일기">${content}</textarea></p>
        <p><button type="submit">UPDATE</button></p>
    </form>
    `;
    }
};