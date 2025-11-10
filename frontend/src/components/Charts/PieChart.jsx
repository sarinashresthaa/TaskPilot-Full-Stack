import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useUsers } from "../../hooks/useUsers";

export default function SimplePieChart() {
  const { data: usersData } = useUsers();

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28FFF",
    "#FF6B6B",
    "#00BFFF",
    "#32CD32",
    "#FFD700",
    "#FF69B4",
  ];

  const data = usersData?.users?.reduce((acc, user) => {
    const department = user.department;
    const existing = acc.find((item) => item.department === department);

    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ department, count: 1 });
    }

    return acc;
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }} className="flex flex-row-reverse">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            cornerRadius={10}
            label={(entry) => entry.department}>
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${entry.department}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-3">
        {data?.map((item, index) => (
          <div key={item.department} className="flex items-center mb-2">
            <div
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              className="w-4 h-4 mr-2 rounded-sm"
            />
            <span className="text-nowrap">
              {item.department} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
