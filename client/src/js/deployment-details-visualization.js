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
        // window.React.createElement(Tooltip),
        window.React.createElement(Tooltip, { cursor: false,   
          contentStyle: { backgroundColor: "#181a1b", color: "#fff" },
        }),  
        window.React.createElement(Legend),
        window.React.createElement(Bar, { dataKey: "maxDuration", fill: "#8884d8" })
      )
    ),
    document.getElementById('performance-chart')
  );
}

function renderDistributionCharts(collectionsData) {
  const assetCountDistribution = [
    { name: '1-10 assets', value: 0 },
    { name: '11-50 assets', value: 0 },
    { name: '51-100 assets', value: 0 },
    { name: '101-500 assets', value: 0 },
    { name: '501+ assets', value: 0 }
  ];

  const ruleCountDistribution = [
    { name: '1-1,000 rules', value: 0 },
    { name: '1,001-10,000 rules', value: 0 },
    { name: '10,001-50,000 rules', value: 0 },
    { name: '50,001-100,000 rules', value: 0 },
    { name: '100,001+ rules', value: 0 }
  ];

  let maxAssets = 0;
  let maxRules = 0;

  Object.values(collectionsData).forEach(col => {
    maxAssets = Math.max(maxAssets, col.assetsTotal);
    maxRules = Math.max(maxRules, col.ruleCnt);

    if (col.assetsTotal <= 10) assetCountDistribution[0].value++;
    else if (col.assetsTotal <= 50) assetCountDistribution[1].value++;
    else if (col.assetsTotal <= 100) assetCountDistribution[2].value++;
    else if (col.assetsTotal <= 500) assetCountDistribution[3].value++;
    else assetCountDistribution[4].value++;

    if (col.ruleCnt <= 1000) ruleCountDistribution[0].value++;
    else if (col.ruleCnt <= 10000) ruleCountDistribution[1].value++;
    else if (col.ruleCnt <= 50000) ruleCountDistribution[2].value++;
    else if (col.ruleCnt <= 100000) ruleCountDistribution[3].value++;
    else ruleCountDistribution[4].value++;
  });

  const { PieChart, Pie, Tooltip, ResponsiveContainer, Legend, Cell, BarChart, Bar, XAxis, YAxis } = window.Recharts;


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      window.React.createElement('text', {
        x: x + width / 2,
        y: y,
        dy: -6 - width / 2,
        textAnchor: 'middle',
        fill: '#000',
      }, `${value}`)
    );
  };

  window.ReactDOM.render(
    window.React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
      window.React.createElement(BarChart, {
        data: assetCountDistribution,
        layout: "vertical",
        margin: { top: 20, right: 30, left: 100, bottom: 5 },
      },
        window.React.createElement(XAxis, { type: "number" }),
        window.React.createElement(YAxis, { type: "category", dataKey: "name" }),
        // window.React.createElement(Tooltip),
        window.React.createElement(Tooltip, { cursor: false,   
          contentStyle: { backgroundColor: "#181a1b", color: "#fff" },
        }),  
        window.React.createElement(Legend, { verticalAlign: "top", height: 36 }),
        window.React.createElement(Bar, {
          dataKey: "value",
          fill: "#8884d8",
          // label: renderCustomizedLabel,
        }, 
          assetCountDistribution.map((entry, index) => 
            window.React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] })
          )
        )
      )
    ),
    document.getElementById('asset-distribution-chart')
  );

  const assetTitle = document.createElement('h4');
  assetTitle.textContent = `Asset Distribution (Max: ${maxAssets} assets)`;
  document.getElementById('asset-distribution-chart').prepend(assetTitle);

  window.ReactDOM.render(
    window.React.createElement(ResponsiveContainer, { width: '100%', height: 400 },
      window.React.createElement(BarChart, {
        data: ruleCountDistribution,
        layout: "vertical",
        margin: { top: 20, right: 30, left: 100, bottom: 5 },
      },
        window.React.createElement(XAxis, { type: "number" }),
        window.React.createElement(YAxis, { type: "category", dataKey: "name" }),
        // window.React.createElement(Tooltip),
        window.React.createElement(Tooltip, { cursor: false,   
          contentStyle: { backgroundColor: "#181a1b", color: "#fff" },
        }),  
        window.React.createElement(Legend, { verticalAlign: "top", height: 36 }),
        window.React.createElement(Bar, {
          dataKey: "value",
          fill: "#82ca9d",
          // label: renderCustomizedLabel,
        },
          ruleCountDistribution.map((entry, index) => 
            window.React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] })
          )
        )
      )
    ),
    document.getElementById('rule-distribution-chart')
  );

  const ruleTitle = document.createElement('h4');
  ruleTitle.textContent = `Rule Distribution (Max: ${maxRules.toLocaleString()} rules)`;
  document.getElementById('rule-distribution-chart').prepend(ruleTitle);
}
