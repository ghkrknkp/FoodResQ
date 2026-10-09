import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const PIE_COLORS = {
  available: '#16a34a',
  claimed: '#3b82f6',
  completed: '#8b5cf6',
  expired: '#6b7280',
};

const DEFAULT_PIE_COLORS = ['#16a34a', '#3b82f6', '#8b5cf6', '#6b7280', '#ea580c', '#f59e0b'];

/**
 * AnalyticsCharts
 *
 * Props:
 *   categoryData       – array of { category: string, count: number }
 *   claimsOverTime     – array of { date: string, count: number }
 *   statusDistribution – array of { name: string, value: number }
 *   impactMetrics      – { totalQuantity: number, co2Saved: number, mealsEquivalent: number }
 */
export default function AnalyticsCharts({
  categoryData = [],
  claimsOverTime = [],
  statusDistribution = [],
  impactMetrics = { totalQuantity: 0, co2Saved: 0, mealsEquivalent: 0 },
}) {
  // ── CSV Export ──────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = [];

    // Header
    rows.push(['category', 'listings_count', 'status', 'status_count', 'date', 'claims_count', 'total_quantity']);

    // Merge all data into rows
    const maxRows = Math.max(
      categoryData.length,
      statusDistribution.length,
      claimsOverTime.length
    );

    for (let i = 0; i < maxRows; i++) {
      rows.push([
        categoryData[i]?.category ?? '',
        categoryData[i]?.count ?? '',
        statusDistribution[i]?.name ?? '',
        statusDistribution[i]?.value ?? '',
        claimsOverTime[i]?.date ?? '',
        claimsOverTime[i]?.count ?? '',
        i === 0 ? (impactMetrics.totalQuantity ?? '') : '',
      ]);
    }

    // If none of the arrays had any rows, add one summary row
    if (maxRows === 0) {
      rows.push(['', '', '', '', '', '', impactMetrics.totalQuantity ?? '']);
    }

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Section header + CSV export */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <button
          onClick={handleExportCSV}
          className="btn btn-outline"
          aria-label="Export analytics data as CSV"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* ── Impact Metrics Card ─────────────────────────────────────────────── */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Total Food Redistributed</p>
            <p className="text-3xl font-bold text-green-600">
              {impactMetrics.totalQuantity.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">kg</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">CO₂ Saved</p>
            <p className="text-3xl font-bold text-blue-600">
              {impactMetrics.co2Saved.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">kg CO₂</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Meals Equivalent</p>
            <p className="text-3xl font-bold text-purple-600">
              {impactMetrics.mealsEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">meals</p>
          </div>
        </div>
      </div>

      {/* ── BarChart — Food Listings by Category ───────────────────────────── */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Listings by Category</h3>
        {categoryData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryData}
              margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                angle={-40}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" name="Listings" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── LineChart — Claims Over Time ────────────────────────────────────── */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Listings Over Time (Last 30 Days)
        </h3>
        {claimsOverTime.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={claimsOverTime}
              margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                angle={-40}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name="Count"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── PieChart — Listing Status Distribution ──────────────────────────── */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Listing Status Distribution
        </h3>
        {statusDistribution.length === 0 || statusDistribution.every((d) => d.value === 0) ? (
          <p className="text-gray-500 text-center py-8">No data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null
                }
                labelLine={false}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      PIE_COLORS[entry.name?.toLowerCase()] ??
                      DEFAULT_PIE_COLORS[index % DEFAULT_PIE_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [value, 'Listings']} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
