import { app, BrowserWindow } from 'electron';
const dev = process.env.NODE_ENV === 'development';

app.on('ready', () => {
    const window = new BrowserWindow({width: 400, height: 300});
    if (dev) {
        window.loadURL('http://localhost:8080');
        window.on('close', () => {
            process.send({ msg: 'close' });
        });
    }
});