import React, { useState } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Define a mapping from category to coordinates
const categoryToCoords = {
  'TR': { x: 10, y: 10 },
  'TL': { x: -10, y: 10 },
  'BR': { x: 10, y: -10 },
  'BL': { x: -10, y: -10 },
};

const getRandomOffset = (scale = 5) => (Math.random() - 0.5) * scale;

const mapCategoryToPosition = (category) => {
  if (categoryToCoords[category]) {
    return {
      x: categoryToCoords[category].x + getRandomOffset(3),
      y: categoryToCoords[category].y + getRandomOffset(3),
    };
  }
  return { x: 0, y: 0 };
};

function App() {
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [data, setData] = useState({
    datasets: [
      {
        label: 'Words1',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Words2',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  });

  const addDataPoint = async (word, datasetIndex) => {
    try {
      const response = await axios.post('http://localhost:8000/predict-category', { word });
      const newCategory = response.data.category;
      const coordinates = mapCategoryToPosition(newCategory);
      setData((prevData) => {
        const newDatasets = prevData.datasets.slice();
        newDatasets[datasetIndex].data.push({ x: coordinates.x, y: coordinates.y, label: word });
        return { datasets: newDatasets };
      });
    } catch (error) {
      console.error('Error predicting category:', error);
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    addDataPoint(word1, 0);
    setWord1('');
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    addDataPoint(word2, 1);
    setWord2('');
  };

  const options = {
    scales: {
      x: {
        min: -20,
        max: 20,
        title: {
          display: true,
          text: 'X-axis',
        },
      },
      y: {
        min: -20,
        max: 20,
        title: {
          display: true,
          text: 'Y-axis',
        },
      },
    },
    plugins: {
      datalabels: {
        color: '#000000',
        anchor: 'end',
        align: 'top',
        offset: 4,
        font: {
          size: 14,
        },
        formatter: (value, context) => context.chart.data.datasets[context.datasetIndex].data[context.dataIndex].label,
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ margin: '20px 0' }}>SEMA EVALUATION APP</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <form onSubmit={handleSubmit1} style={{ margin: '20px auto', maxWidth: '300px' }}>
          <input
            type="text"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
            placeholder="Enter a word ( Group 01 )"
            style={{ marginRight: '10px', padding: '10px', width: 'calc(100% - 120px)' }}
          />
          <button
            type="submit"
            style={{ padding: '15px', backgroundColor: 'red', borderRadius: '8px', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Submit
          </button>
        </form>
        <form onSubmit={handleSubmit2} style={{ margin: '20px auto', maxWidth: '300px' }}>
          <input
            type="text"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
            placeholder="Enter a word ( Group 02 )"
            style={{ marginRight: '10px', padding: '10px', width: 'calc(100% - 120px)' }}
          />
          <button
            type="submit"
            style={{ padding: '15px', backgroundColor: 'blue', borderRadius: '8px', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Submit
          </button>
        </form>
      </div>
      <div style={{ margin: '20px' }}>
        <Scatter data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
}

export default App;
