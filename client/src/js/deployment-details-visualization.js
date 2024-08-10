// deployment-visualization.js

export function createVisualizationComponent(data) {
  const container = document.createElement('div');
  container.className = 'visualization-container';

  // Summary Section
  const summarySection = document.createElement('div');
  summarySection.innerHTML = `
    <h3>Summary</h3>
    <p>Total Collections: ${Object.keys(data.countsByCollection).length}</p>
    <p>Total Assets: ${Object.values(data.countsByCollection).reduce((sum, col) => sum + col.assetsTotal, 0)}</p>
    <p>Total Rules: ${Object.values(data.countsByCollection).reduce((sum, col) => sum + col.ruleCnt, 0)}</p>
    <p>Total Reviews: ${Object.values(data.countsByCollection).reduce((sum, col) => sum + col.reviewCntTotal, 0)}</p>
  `;
  container.appendChild(summarySection);

  // Performance Section
  const performanceSection = document.createElement('div');
  performanceSection.innerHTML = '<h3>Slowest Operation Responses</h3>';
  const performanceChart = document.createElement('div');
  performanceChart.id = 'performance-chart';
  performanceChart.style.width = '100%';
  performanceChart.style.height = '300px';
  performanceSection.appendChild(performanceChart);
  container.appendChild(performanceSection);

  // Distribution Section
  const distributionSection = document.createElement('div');
  distributionSection.innerHTML = '<h3>Collection Size Distribution</h3>';
  const assetChart = document.createElement('div');
  assetChart.id = 'asset-distribution-chart';
  assetChart.style.width = '50%';
  assetChart.style.height = '300px';
  assetChart.style.float = 'left';
  const ruleChart = document.createElement('div');
  ruleChart.id = 'rule-distribution-chart';
  ruleChart.style.width = '50%';
  ruleChart.style.height = '300px';
  ruleChart.style.float = 'left';
  distributionSection.appendChild(assetChart);
  distributionSection.appendChild(ruleChart);
  container.appendChild(distributionSection);

  // Render charts after the container is added to the DOM
  setTimeout(() => {
    renderPerformanceChart(data);
    renderDistributionCharts(data.countsByCollection);
  }, 0);

  return container;
}

function renderPerformanceChart(data) {
  const slowestOperations = Object.entries(data.operationalStats.operationIdStats)
    .map(([id, stats]) => ({ id, maxDuration: stats.maxDuration }))
    .sort((a, b) => b.maxDuration - a.maxDuration)
    .slice(0, 5);

  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts;

  window.ReactDOM.render(
    window.React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
      window.React.createElement(BarChart, {
        data: slowestOperations,
        margin: { top: 5, right: 30, left: 20, bottom: 5 },
      },
        window.React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
        window.React.createElement(XAxis, { dataKey: "id" }),
        window.React.createElement(YAxis),
        window.React.createElement(Tooltip),
        window.React.createElement(Legend),
        window.React.createElement(Bar, { dataKey: "maxDuration", fill: "#8884d8" })
      )
    ),
    document.getElementById('performance-chart')
  );
}

function renderDistributionCharts(collectionsData) {
  const assetCountDistribution = [
    { name: '1-5 assets', value: 0 },
    { name: '6-10 assets', value: 0 },
    { name: '11-15 assets', value: 0 },
    { name: '16+ assets', value: 0 }
  ];

  const ruleCountDistribution = [
    { name: '1-1000 rules', value: 0 },
    { name: '1001-10000 rules', value: 0 },
    { name: '10001-100000 rules', value: 0 },
    { name: '100001+ rules', value: 0 }
  ];

  Object.values(collectionsData).forEach(col => {
    if (col.assetsTotal <= 5) assetCountDistribution[0].value++;
    else if (col.assetsTotal <= 10) assetCountDistribution[1].value++;
    else if (col.assetsTotal <= 15) assetCountDistribution[2].value++;
    else assetCountDistribution[3].value++;

    if (col.ruleCnt <= 1000) ruleCountDistribution[0].value++;
    else if (col.ruleCnt <= 10000) ruleCountDistribution[1].value++;
    else if (col.ruleCnt <= 100000) ruleCountDistribution[2].value++;
    else ruleCountDistribution[3].value++;
  });

  const { PieChart, Pie, Tooltip, ResponsiveContainer } = window.Recharts;

  window.ReactDOM.render(
    window.React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
      window.React.createElement(PieChart,
        {},
        window.React.createElement(Pie, {
          data: assetCountDistribution,
          dataKey: "value",
          nameKey: "name",
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          fill: "#8884d8",
          label: true
        }),
        window.React.createElement(Tooltip)
      )
    ),
    document.getElementById('asset-distribution-chart')
  );

  window.ReactDOM.render(
    window.React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
      window.React.createElement(PieChart,
        {},
        window.React.createElement(Pie, {
          data: ruleCountDistribution,
          dataKey: "value",
          nameKey: "name",
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          fill: "#82ca9d",
          label: true
        }),
        window.React.createElement(Tooltip)
      )
    ),
    document.getElementById('rule-distribution-chart')
  );
}