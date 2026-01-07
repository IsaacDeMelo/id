
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB Atlas (Cluster0 fornecido pelo usuário)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://isaachonorato41:brasil2021@cluster0.rxemo.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Conectado no Cluster0 (Atlas)'))
  .catch(err => console.error('❌ Erro de Conexão MongoDB:', err));

// Schema da Loja
const storeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  storeName: String,
  storeTagline: String,
  theme: Object,
  products: Array
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

// API Routes
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stores/:slug', async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) return res.status(404).json({ message: 'Loja não encontrada' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stores', async (req, res) => {
  try {
    const { id } = req.body;
    // Upsert: Atualiza se existir pelo ID, senão cria
    const store = await Store.findOneAndUpdate({ id }, req.body, { upsert: true, new: true });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stores/:id', async (req, res) => {
  try {
    await Store.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servir arquivos estáticos do Frontend (Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// Qualquer rota que não seja API, serve o index.html (SPA routing)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
