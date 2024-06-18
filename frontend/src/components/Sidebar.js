import Link from "next/link";

const Sidebar = ({ setShowModal }) => {
    return (
        <aside className="w-1/5 bg-purple-800 text-white p-8 h-screen fixed">
            <h2 className="text-2xl font-bold mb-8">ADMIN DASHBOARD</h2>
            <nav>
                <ul>
                    <li className="mb-4">
                        <Link href="/admin/concerts" className="flex items-center">
                            <span>Concerts</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/admin/bands" className="flex items-center">
                            <span>Bands</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/admin/tickets" className="flex items-center">
                            <span>Tickets</span>
                        </Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/admin/payments" className="flex items-center">
                            <span>Payments</span>
                        </Link>
                    </li>
                    <li>
                        <a href="#" className="flex items-center" onClick={() => setShowModal(true)}>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;