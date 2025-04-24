import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';

const Layout = () => {
  const location = useLocation();
  const hiddenSidebarRoutes = ['/', '/signin', '/signup'];
  const shouldHideSidebar = hiddenSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {!shouldHideSidebar && <Sidebar />}
      <div className="flex-1 p-4">
        <AppRoutes />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
