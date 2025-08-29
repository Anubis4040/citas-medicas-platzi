import {Router} from 'express';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import validateSaveUser from './middlewares/saveUserValidator.js'

export const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, 'data.json');

console.log(usersFilePath, 'usersFilePath');

router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (err) {
    console.error('Error reading or parsing users file:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', validateSaveUser, (req, res) => {
  try {
    const newUser = req.body;
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(data);
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.json(users);
    
  } catch (err) {
    console.error('Error reading or parsing users file:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(data);
    const user = users.find(u => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error reading or parsing users file:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', (req, res) => {
  const userId = req.params.id;
  try {
    const newUser = req.body;
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(data);
    const user = users.find(u => u.id === userId);
    if (user) {
      const updated = { ...user, ...newUser }
      console.log(updated, 'updated');
      const updatedUsers = users.map(u => u.id === userId ? updated : u);
      fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));
      res.json(updated);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error reading or parsing users file:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    const users = JSON.parse(data);
    const updatedUsers = users.filter(u => u.id !== userId);
    if (updatedUsers.length < users.length) {
      console.log(updatedUsers, 'updatedUsers');
      fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error reading or parsing users file:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});