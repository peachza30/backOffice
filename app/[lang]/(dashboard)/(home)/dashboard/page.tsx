import { getDictionary } from "@/app/dictionaries";

interface DashboardProps {
  params: {
    lang: any;
  };
}
const Dashboard = async ({ params: { lang } }: DashboardProps) => {
  const trans = await getDictionary(lang);
  return (
    <div className="">
      <p>Dashboard</p>
    </div>
  );
};

export default Dashboard;
