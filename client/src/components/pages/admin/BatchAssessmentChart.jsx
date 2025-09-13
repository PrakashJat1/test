import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Simulated API response
const apiData = [
  { batchName: "Batch 10", month: 3, year: 2025, averageScore: 8 },
  { batchName: "Batch 10", month: 4, year: 2025, averageScore: 12 },
  { batchName: "Batch 10", month: 5, year: 2025, averageScore: 15 },
  { batchName: "Batch 10", month: 6, year: 2025, averageScore: 17 },
  { batchName: "Batch 10", month: 7, year: 2025, averageScore: 19 },

  { batchName: "Batch 11", month: 3, year: 2025, averageScore: 10 },
  { batchName: "Batch 11", month: 4, year: 2025, averageScore: 13 },
  { batchName: "Batch 11", month: 5, year: 2025, averageScore: 16 },
  { batchName: "Batch 11", month: 6, year: 2025, averageScore: 18 },
  { batchName: "Batch 11", month: 7, year: 2025, averageScore: 19.5 },

  { batchName: "Batch 12", month: 3, year: 2025, averageScore: 11 },
  { batchName: "Batch 12", month: 4, year: 2025, averageScore: 13.5 },
  { batchName: "Batch 12", month: 5, year: 2025, averageScore: 17 },
  { batchName: "Batch 12", month: 6, year: 2025, averageScore: 19 },
  { batchName: "Batch 12", month: 7, year: 2025, averageScore: 20 },

  { batchName: "Batch 13", month: 3, year: 2025, averageScore: 7 },
  { batchName: "Batch 13", month: 4, year: 2025, averageScore: 10 },
  { batchName: "Batch 13", month: 5, year: 2025, averageScore: 13 },
  { batchName: "Batch 13", month: 6, year: 2025, averageScore: 15.5 },
  { batchName: "Batch 13", month: 7, year: 2025, averageScore: 17 },

  { batchName: "Batch 14", month: 3, year: 2025, averageScore: 6.5 },
  { batchName: "Batch 14", month: 4, year: 2025, averageScore: 9 },
  { batchName: "Batch 14", month: 5, year: 2025, averageScore: 12 },
  { batchName: "Batch 14", month: 6, year: 2025, averageScore: 14 },
  { batchName: "Batch 14", month: 7, year: 2025, averageScore: 16 },

  { batchName: "Batch 15", month: 3, year: 2025, averageScore: 9 },
  { batchName: "Batch 15", month: 4, year: 2025, averageScore: 12.5 },
  { batchName: "Batch 15", month: 5, year: 2025, averageScore: 16.5 },
  { batchName: "Batch 15", month: 6, year: 2025, averageScore: 18.5 },
  { batchName: "Batch 15", month: 7, year: 2025, averageScore: 19.2 },
];

const formatMonth = (month, year) => {
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const BatchAssessmentChart = () => {
  const batches = [...new Set(apiData.map((d) => d.batchName))];
  const months = [...new Set(apiData.map((d) => `${d.month}-${d.year}`))];

  const chartData = months.map((monthYear) => {
    const [m, y] = monthYear.split("-");
    const label = formatMonth(Number(m), Number(y));
    const entry = { month: label };

    batches.forEach((batch) => {
      const match = apiData.find(
        (d) =>
          d.batchName === batch &&
          d.month === Number(m) &&
          d.year === Number(y)
      );
      entry[batch] = match?.averageScore ?? null;
    });

    return entry;
  });

  const colors = [
    "#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8", "#6f42c1", "#fd7e14",
  ];

  return (
    <div
      style={{
        width: "50%",
        height : "430px",
        padding: "0%",
        backgroundColor: "#fff",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "110%",
          fontWeight: "500",
          paddingTop: "2%",
          color: "#052c52"
        }}
      >
        📊 Batch-wise Monthly Assessment Performance
      </h2>
      <ResponsiveContainer width="80%" height="95%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <defs>
            <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ccc" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="url(#gridGradient)" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 14 }}
            label={{
              value: "Month",
              position: "insideBottom",
              dy: 30,
              fontSize: 16,
              fill: "#444",
            }}
          />
          <YAxis
            domain={[0, 25]}
            tick={{ fontSize: 14 }}
            label={{
              value: "Average Score",
              angle: -90,
              position: "insideLeft",
              dx: -10,
              fontSize: 16,
              fill: "#444",
            }}
          />
          <Tooltip
            contentStyle={{ fontSize: "14px", borderRadius: "10px" }}
            formatter={(value) => [`${value.toFixed(2)}`, "Score"]}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ fontSize: "14px"}}
          />
          {batches.map((batch, index) => (
            <Line
              key={batch}
              type="monotone"
              dataKey={batch}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BatchAssessmentChart;
