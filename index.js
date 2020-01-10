const app = require('http').createServer()
const io = require('socket.io')(app);

let editor = null
let site = null

app.listen(3000, () => console.log('listening to port 3000'));

io.on('connection', function(socket){
    console.log('a client connected...')

    socket.on('editor:register', function(siteURL) {
        console.log(`An editor registered for the site ${siteURL}`)
        editor = new Editor(socket, siteURL)

        if (!!site) {
            console.log('Pairing editor with the site...')
            editor.site = site
        }
    });

    socket.on('site:register', function(siteURL) {
        console.log('A site registered: ', siteURL)
        site = new Site(socket, siteURL)
        if (!!editor) {
            console.log('Pairing site with the editor...')
            editor.site = site
        }
    });
});

class Site {
    constructor(socket, siteURL) {
        this.socket = socket
        this.siteURL = siteURL
    }

    reload() {
        console.log('editor reloading site...')
        this.socket.emit('site:reload')
    }

    refreshCSS() {
        console.log('editor refreshing css...')
        this.socket.emit('site:refreshCSS')
    }
}

class Editor {
    constructor (socket, siteURL) {
        this.socket = socket
        this.siteURL = siteURL
        this._site = null

        this.socket.on('editor:refreshCSS', () => this._site.refreshCSS())
        this.socket.on('editor:reload', () => this._site.reload())

    }

    set site(site) {
        this._site = site
    }
}
