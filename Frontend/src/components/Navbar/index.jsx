import { useEffect, useState } from 'react';
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const { data: user, isLoading } = useLoggedInUser();
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoggedOut(true);
    }
  }, [isLoading, user]);

  const handleSignIN = () => {
    navigate("/sign-in");
  }

  const toHome = () => {
    navigate("/");
  }

  const handleLogOut = () => {
    localStorage.removeItem('token');
    setIsLoggedOut(true);
    navigate('/');
    window.location.reload();
  }

  // console.log('logged IN',isLoggedOut);
  // console.log('user',user,'isLoading', isLoading);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn btn-ghost" onClick={toHome}>
          <span className="text-4xl underline decoration-primary">
            Movie-Book<span className="text-primary">KARLE</span>
          </span>
        </a>
      </div>
      <div className="navbar-center">
        <label className="input input-bordered flex items-center gap-2 rounded-full">
          <input
            type="text"
            className="grow rounded-full"
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="navbar-end">
        <div>
          <ul className="menu menu-horizontal ">
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>


        {isLoggedOut ? <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a onClick={handleLogOut}>Logout</a>
            </li>
          </ul>
        </div> : <button className='btn btn-outline btn-primary' onClick={handleSignIN}> SIGN IN</button>}
        
      </div>
    </div>
  );
};

export default Navbar;
