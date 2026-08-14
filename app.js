// Function to fetch JSON and render chart
async function createChart() {
    try {
        // Fetch data from your JSON file
        const response = await fetch('data.json');
        const jsonData = await response.json();

        // Parse JSON data into separate arrays using map()
        const labels = jsonData.map(item => item.day);
        const dataValues = jsonData.map(item => item.amount);

        // Target the HTML canvas element
        const ctx = document.getElementById('myBarChart').getContext('2d');

        // Find today's day of the week and check if it matches any day in the JSON data
        const today = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
        const isToday = jsonData.map(item => item.day === today);

        // Initialize Chart.js
        new Chart(ctx, {
            type: 'bar', 
            data: {
                labels: labels, // Set x-axis labels
                datasets: [{
                    label: '',
                    data: dataValues, // Set y-axis values
                    borderColor: isToday.map(t => t ? 'hsl(186, 34%, 60%)' : 'hsl(10, 79%, 65%)'),
                    backgroundColor: isToday.map(t => t ? 'hsl(186, 34%, 60%)' : 'hsl(10, 79%, 65%)'),
                    hoverBackgroundColor: isToday.map(t => t ? 'hsl(186, 55%, 82%)' : 'hsl(10, 79%, 80%)'),
                    hoverBorderColor: isToday.map(t => t ? 'hsl(186, 55%, 82%)' : 'hsl(10, 79%, 80%)'),
                    borderRadius: {
                        topLeft: 5,
                        topRight: 5,
                        bottomLeft: 5,
                        bottomRight: 5
                    },
                    borderSkipped: false,
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false // Hides the legend
                    },
                    tooltip: {
                        xAlign: 'center', // Centers the tooltip horizontally
                        yAlign: 'bottom', // Positions the tooltip above the bar
                        caretSize: 0, // Removes the caret/arrow from the tooltip
                        displayColors: false, // Hides the color box in the tooltip
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            },
                            title: () => '' // Hides the title in the tooltip
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false, // Hides x-axis grid lines
                            border: { display: false },
                            ticks: { color: 'hsl(28, 10%, 53%)', font: { family: 'DM Sans', size: 15 }, padding: 8 }
                        },
                        border: {
                            display: false // Hides the x-axis border line
                        }
                    },
                    y: {
                        beginAtZero: true, // Ensures graph starts at 0
                        grid: {
                            display: false // Hides y-axis grid lines   
                        },
                        ticks: {
                            display: false // This completely hides the X-axis text numbers/labels
                        },
                        border: {
                            display: false // Hides the y-axis border line
                        }
                    }
                }
            }
        });

        document.getElementById('chart-data').innerHTML =
            '<caption>Spending, last 7 days</caption><tr><th>Day</th><th>Amount</th></tr>' +
            jsonData.map(d => `<tr><td>${d.day}</td><td>$${d.amount.toFixed(2)}</td></tr>`).join('');

    } catch (error) {
        console.error('Error loading or parsing JSON data:', error);
    }
}

// Execute the function when the page loads
window.onload = createChart;