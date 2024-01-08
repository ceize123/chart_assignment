export const getDatasets = (data) => {
  const arr = [];
  for (let key in data) {
    const trimData = getTrimData(data[key]);
    let obj = {
      datasets: [
        {
          label: key,
          data: trimData,
          backgroundColor: getColor(key),
        },
        {
          label: 'Trend Line',
          data: getTrendLine(trimData),
          backgroundColor: getColor(),
        },
      ],
    };
    arr.push(obj);
  }

  return arr;
};

// Get dataset based on code
export const getCurrentDatasets = (data, code) => {
  return data.find((item) => item.code === code).dataArr;
};

const getTrendLine = (data) => {
  // Group the data into chunks of 5
  let groups = [];
  let previousY = null;
  for (
    let i = Math.min(...data.map((point) => Math.round(point.x)));
    i <= Math.max(...data.map((point) => Math.round(point.x)));
    i += 5
  ) {
    // calculate the average 'y' value for the current element, previous 2 elements, and next 2 elements
    let group = data.filter((point) => {
      let x = Math.round(parseFloat(point.x));
      return x < i + 15 && x >= i - 15;
    });
    let averageY;
    if (group.length > 0) {
      averageY =
        group.reduce((sum, point) => sum + parseFloat(point.y), 0) /
        group.length;
      previousY = averageY;
    } else if (previousY !== null) {
      averageY = previousY;
    }
    if (averageY !== undefined) {
      groups.push({ x: i.toString(), y: averageY.toString() });
    }
  }

  return groups;
};

const getTrimData = (data) => {
  const trimedData = data.trim().split(/[ \t]/);
  let result = [];
  for (let i = 0; i < trimedData.length; i += 4) {
    result.push(trimedData.slice(i, i + 4));
  }

  return result.map((item) => ({
    x: item[3],
    y: item[0],
  }));
};

export const getColor = (key) => {
  switch (key) {
    case '左一':
      return 'rgb(255, 99, 132)';
    case '左二':
      return 'rgb(54, 162, 235)';
    case '左三':
      return 'rgb(255, 206, 86)';
    case '右一':
      return 'rgb(255, 99, 132)';
    case '右二':
      return 'rgb(54, 162, 235)';
    case '右三':
      return 'rgb(255, 206, 86)';
    default:
      return 'rgb(60, 82, 51)';
  }
};
