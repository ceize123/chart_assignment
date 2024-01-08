import Papa from 'papaparse';
import data from './data.csv';
import { useState, useEffect } from 'react';
import { getDatasets, getCurrentDatasets, getColor } from './helpers';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  annotationPlugin
);

export const options = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 3,
  scales: {
    y: {
      min: -20,
      max: 80,
    },
  },
  plugins: {
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 0,
          yMax: 0,
          borderColor: getColor(),
          borderWidth: 1,
        },
      },
    },
  },
};

function App() {
  const [csvData, setCsvData] = useState(null);
  const [currentCode, setCurrentCode] = useState('');

  useEffect(() => {
    Papa.parse(data, {
      download: true,
      header: true,
      complete: function (results) {
        const res = results.data.map((item) => {
          let { 代號, ...rest } = item;
          let obj = {
            code: 代號,
            dataArr: getDatasets(rest),
          };
          return obj;
        });
        setCsvData(res);
        setCurrentCode(res[0].code);
      },
    });
  }, []);

  const handleOnChange = (e) => {
    setCurrentCode(e.target.value);
  };

  return (
    <div className='App p-4'>
      <div className='flex mb-8'>
        <p className='font-bold mr-2'>使用者代號:</p>
        <select
          onChange={handleOnChange}
          className='border rounded-md border-gray-500 px-1'
        >
          {csvData &&
            csvData.map((item, idx) => (
              <option key={idx} value={item.code}>
                {item.code}
              </option>
            ))}
        </select>
      </div>
      {csvData && currentCode && (
        <div>
          <div className='md:flex justify-around hidden mb-4'>
            {['左手', '右手'].map((item, idx) => (
              <p
                key={idx}
                className='w-1/3 text-center bg-slate-200 rounded-md py-1'
              >
                {item}
              </p>
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-rows-3 md:grid-cols-2 md:grid-flow-col gap-y-4 gap-x-8 relative mx-auto h-[80vh]'>
            {getCurrentDatasets(csvData, currentCode).map((item, idx) => (
              <div key={idx}>
                <Scatter options={options} data={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
