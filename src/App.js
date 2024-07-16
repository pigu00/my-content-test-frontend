import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const estadosValidos = ['Contactado', 'Esperando respuesta', 'En llamada', 'Win', 'Lose'];

function App() {
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [formValues, setFormValues] = useState({
    agendacion: '',
    email: '',
    closer: '',
    estado: '',
    comentarios: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/api/data');
        const filteredData = response.data.slice(1).map(row => [
          row[0] || '', // Agendacion
          row[1] || '', // Email
          row[2] || '', // UTM Source
          row[3] || '', // UTM Campaign
          row[4] || '', // UTM Medium
          row[5] || '', // UTM Term
          row[6] || '', // UTM Content
          row[7] || '', // Closer
          row[8] || '', // Estado
          row[9] || '' // Comentarios
        ]);
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }

    fetchData();
  }, []);

  const handleEdit = (index) => {
    setEditRow(index);
    setFormValues({
      agendacion: data[index][0] || '', // Manejo de campo vacio
      email: data[index][1] || '', 
      closer: data[index][7] || '', 
      estado: data[index][8] || '', 
      comentarios: data[index][9] || '' 
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSave = async (index) => {
    const updatedData = [...data];
    updatedData[index] = [
      formValues.agendacion,
      formValues.email,
      data[index][2], // UTM Source
      data[index][3], // UTM Campaign
      data[index][4], // UTM Medium
      data[index][5], // UTM Term
      data[index][6], // UTM Content
      formValues.closer,
      formValues.estado,
      formValues.comentarios
    ];
    setData(updatedData);
    setEditRow(null);

    try {
      await axios.post('http://localhost:3001/api/update', {
        range: `Leads!A${index + 2}:J${index + 2}`, 
        values: [[
          updatedData[index][0], // Agendacion
          updatedData[index][1], // Email
          updatedData[index][2], // UTM Source
          updatedData[index][3], // UTM Campaign
          updatedData[index][4], // UTM Medium
          updatedData[index][5], // UTM Term
          updatedData[index][6], // UTM Content
          updatedData[index][7], // Closer
          updatedData[index][8], // Estado
          updatedData[index][9] // Comentarios
        ]]
      });
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  return (
    <div className="App">
      <h1>Listado de llamados</h1>
      <table>
        <thead>
          <tr>
            <th>Agendacion</th>
            <th>Email</th>
            <th>Closer</th>
            <th>Estado</th>
            <th>Comentarios</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {editRow === index ? (
                <>
                  <td><input type="text" name="agendacion" value={formValues.agendacion} onChange={handleChange} /></td>
                  <td><input type="text" name="email" value={formValues.email} onChange={handleChange} /></td>
                  <td><input type="text" name="closer" value={formValues.closer} onChange={handleChange} /></td>
                  <td>
                    <select name="estado" value={formValues.estado} onChange={handleChange}>
                      {estadosValidos.map((estado, idx) => (
                        <option key={idx} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="text" name="comentarios" value={formValues.comentarios} onChange={handleChange} /></td>
                  <td><button onClick={() => handleSave(index)}>Guardar</button></td>
                </>
              ) : (
                <>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[7]}</td>
                  <td>{row[8]}</td>
                  <td>{row[9]}</td>
                  <td><button onClick={() => handleEdit(index)}>Editar</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
