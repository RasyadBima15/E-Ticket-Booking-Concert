import Link from "next/link";

const Sidebar = ({ setShowModal }) => {
    return (
        <aside className="w-1/5 bg-purple-800 text-white p-8 h-screen fixed" style={{ backgroundImage: `url('/images/bg_login.png')` }}>
        <h2 className="text-2xl font-bold mb-8">ADMIN DASHBOARD</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/admin/concerts" className="flex items-center">
                <img src="/images/logos/logo_concert.png" alt="Concerts" className="mr-2" width="20" height="20" />
                <span>Concerts</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/bands" className="flex items-center">
                <img src="/images/logos/logo_band.png" alt="Bands" className="mr-2" width="20" height="20" />
                <span>Bands</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/tickets" className="flex items-center">
                <img src="/images/logos/logo_ticket.png" alt="Tickets" className="mr-2" width="20" height="20" />
                <span>Tickets</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/payments" className="flex items-center">
                <img src="/images/logos/logo_payment.png"alt="Payments" className="mr-2" width="20" height="20" />
                <span>Payments</span>
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center" onClick={() => setShowModal(true)}>
              <img src="/images/logos/logo_concert.png" alt="Logout" className="mr-2 transform rotate-180" width="20" height="20" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      
    );
}

export default Sidebar;