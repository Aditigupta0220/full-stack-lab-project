const express = require('express');
const fileHandler = require('./modules/fileHandler');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const employees = await fileHandler.read();
  res.render('index', { employees });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { name, department, basicSalary } = req.body;
  
  if (!name || !department || !basicSalary || Number(basicSalary) < 0) {
    return res.redirect('/add');
  }

  const employees = await fileHandler.read();
  
  const newEmployee = {
    id: Date.now(),
    name: name,
    department: department,
    basicSalary: Number(basicSalary)
  };
  
  employees.push(newEmployee);
  await fileHandler.write(employees);
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const employees = await fileHandler.read();
  const employee = employees.find(emp => emp.id === Number(req.params.id));
  
  if (!employee) {
    return res.redirect('/');
  }
  
  res.render('edit', { employee });
});

app.post('/edit/:id', async (req, res) => {
  const { name, department, basicSalary } = req.body;
  
  if (!name || !department || !basicSalary || Number(basicSalary) < 0) {
    return res.redirect('/edit/' + req.params.id);
  }

  const employees = await fileHandler.read();
  const index = employees.findIndex(emp => emp.id === Number(req.params.id));
  
  if (index !== -1) {
    employees[index] = {
      id: Number(req.params.id),
      name: name,
      department: department,
      basicSalary: Number(basicSalary)
    };
    await fileHandler.write(employees);
  }
  
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  const employees = await fileHandler.read();
  const filteredEmployees = employees.filter(emp => emp.id !== Number(req.params.id));
  await fileHandler.write(filteredEmployees);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
