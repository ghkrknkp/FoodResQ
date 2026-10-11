const https = require('https');
const fs = require('fs');
const path = require('path');

const tamilImages = [
  { name: 'dosa.jpg', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80' },
  { name: 'idli.jpg', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { name: 'tamil_meals.jpg', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80' },
  { name: 'vada_sambar.jpg', url: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=800&q=80' },
  { name: 'pongal.jpg', url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80' },
  { name: 'parotta.jpg', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' }
];

const clientDir = path.join(__dirname, '../client/public/images');
const serverDir = path.join(__dirname, 'uploads');

function download(url, fileName) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, fileName).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${fileName}`));
      }
      const cPath = path.join(clientDir, fileName);
      const sPath = path.join(serverDir, fileName);
      const ws = fs.createWriteStream(cPath);
      res.pipe(ws);
      ws.on('finish', () => {
        ws.close();
        fs.copyFileSync(cPath, sPath);
        console.log(`Downloaded ${fileName}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const item of tamilImages) {
    try {
      await download(item.url, item.name);
    } catch (err) {
      console.error(err.message);
    }
  }
  console.log('Tamil Nadu culture images ready!');
}

run();
