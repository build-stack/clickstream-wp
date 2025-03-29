import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PageView {
  path: string;
  views: number;
  avgTimeOnPage: number;
}

interface InsightsDashboardProps {
  timeseriesData: {
    labels: string[];
    visitors: number[];
    pageviews: number[];
  };
  topPages: PageView[];
  interactionMetrics: {
    avgSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
  };
}

export function InsightsDashboard({ timeseriesData, topPages, interactionMetrics }: InsightsDashboardProps) {
  const visitorData: ChartData<'line'> = {
    labels: timeseriesData.labels,
    datasets: [
      {
        label: 'Visitors',
        data: timeseriesData.visitors,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Pageviews',
        data: timeseriesData.pageviews,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const topPagesData: ChartData<'bar'> = {
    labels: topPages.map(page => page.path),
    datasets: [
      {
        label: 'Page Views',
        data: topPages.map(page => page.views),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="insights-dashboard">
      <div className="metrics-overview">
        <div className="metric-card">
          <h3>Avg. Session Duration</h3>
          <div className="metric-value">{formatTime(interactionMetrics.avgSessionDuration)}</div>
        </div>
        <div className="metric-card">
          <h3>Bounce Rate</h3>
          <div className="metric-value">{interactionMetrics.bounceRate.toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <h3>Pages per Session</h3>
          <div className="metric-value">{interactionMetrics.pagesPerSession.toFixed(1)}</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h3>Traffic Overview</h3>
          <Line
            data={visitorData}
            options={{
              responsive: true,
              interaction: {
                mode: 'index' as const,
                intersect: false,
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="chart-container">
          <h3>Top Pages</h3>
          <Bar
            data={topPagesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="pages-table">
        <h3>Page Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Views</th>
              <th>Avg. Time on Page</th>
            </tr>
          </thead>
          <tbody>
            {topPages.map((page) => (
              <tr key={page.path}>
                <td>{page.path}</td>
                <td>{page.views.toLocaleString()}</td>
                <td>{formatTime(page.avgTimeOnPage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 