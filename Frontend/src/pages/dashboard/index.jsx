import { useEffect } from "react";
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admin-dashboard";
import Homepage from "../homepage";

const DashboardPage = () => {
  const { data: user, isLoading } = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Please go away"); // Todo: Debug this and make this work!
      navigate("/sign-in");
    }
  }, [isLoading, navigate, user]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "user" && <Homepage />}
    </>
  );
};

export default DashboardPage;
