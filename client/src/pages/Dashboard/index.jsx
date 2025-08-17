import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

import Authenticated from "./Authenticated";
import NotAuthenticated from "./NotAuthenticated";

function Dashboard() {
  const { user } = useContext(AppContext);

  return user ? <Authenticated /> : <NotAuthenticated />;
}

export default Dashboard;
