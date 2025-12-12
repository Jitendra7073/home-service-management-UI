import ChartLineLinear from "@/components/provider/dashboard/chart-view";
import { ServiceChart } from "@/components/provider/dashboard/service-chart";

const Charts = () => {
  const Chart = {
    title: "Revenue Chart",
    description: "revenue description",
  };

  return (
    <>
      <ChartLineLinear title={Chart.title} description={Chart.description} />
      <ServiceChart />
    </>
  );
};

export default Charts;
