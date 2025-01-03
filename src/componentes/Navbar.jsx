import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="bg-fondoMovil h-60 bg-no-repeat p-4 flex justify-between items-center md:bg-fondo md:bg-cover md:h-96 ">
    <Link to="/" className="sm:text-5xl text-white font-bold">filmFinder</Link>
    <Link to="/watchlist" className="sm:text-5xl text-white font-bold">Mi Watchlist</Link>
  </div>
);

export default Navbar;
