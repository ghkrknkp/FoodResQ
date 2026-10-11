const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'curry_rice.jpg', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80' },
  { name: 'pasta_meal.jpg', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80' },
  { name: 'pizza_slices.jpg', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80' },
  { name: 'salad_bowl.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { name: 'bread_loaves.jpg', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'croissants_pastries.jpg', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' },
  { name: 'cupcakes_donuts.jpg', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { name: 'fresh_apples.jpg', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80' },
  { name: 'mixed_berries.jpg', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80' },
  { name: 'tropical_fruits.jpg', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80' },
  { name: 'leafy_greens.jpg', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { name: 'tomatoes_peppers.jpg', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { name: 'canned_goods.jpg', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { name: 'cereal_boxes.jpg', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' },
  { name: 'fresh_juices.jpg', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80' },
  { name: 'coffee_tea.jpg', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
  { name: 'sandwiches_wraps.jpg', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80' },
  { name: 'snack_boxes.jpg', url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80' }
];

const clientDir = path.join(__dirname, '../client/public/images');
const serverDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir, { recursive: true });
if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });

function downloadFile(url, fileName) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, fileName).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }

      const clientFilePath = path.join(clientDir, fileName);
      const serverFilePath = path.join(serverDir, fileName);

      const clientStream = fs.createWriteStream(clientFilePath);
      res.pipe(clientStream);

      clientStream.on('finish', () => {
        clientStream.close();
        fs.copyFileSync(clientFilePath, serverFilePath);
        console.log(`Saved ${fileName}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${fileName}:`, err.message);
      reject(err);
    });
  });
}

async function run() {
  for (const img of images) {
    try {
      await downloadFile(img.url, img.name);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('All additional pictures downloaded successfully!');
}

run();
