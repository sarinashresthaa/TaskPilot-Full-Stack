import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SimpleBarChart = (props) => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxHeight: "40vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={props.data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis  />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="Tasks"
        fill="#8884d8"
      />
    </BarChart>
  );
};

export default SimpleBarChart;
