const temperatureCtx = document.getElementById('realtimeTemperatureChart').getContext('2d');
const temperatureChart = new Chart(temperatureCtx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 10 }, (_, i) => `T-${i}s`),
    datasets: [{
      label: 'Temperature (°C)',
      data: Array.from({ length: 10 }, () => Math.random() * 10 + 20),
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      fill: false
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 0 }
  }
});

setInterval(async () => {
  const response = await fetch('/api/temperature');
  const { temperature } = await response.json();
  document.getElementById('temperature').textContent = temperature;
  temperatureChart.data.datasets[0].data.push(temperature);
  temperatureChart.data.datasets[0].data.shift();
  temperatureChart.update();
}, 1000);

const averageCtx = document.getElementById('averageUseChart').getContext('2d');
new Chart(averageCtx, {
  type: 'bar',
  data: {
    labels: ['Day', 'Month', 'Year'],
    datasets: [{
      label: 'Usage Hours',
      data: [8, 200, 2400],
      backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)']
    }]
  },
  options: {
    responsive: true
  }
});
