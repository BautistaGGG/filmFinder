import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="bg-gray-800 p-4 flex justify-between">
    <Link to="/" className="text-white font-bold">filmFinder</Link>
    <Link to="/watchlist" className="text-white font-bold">Mi Watchlist</Link>
  </div>
);

export default Navbar;
