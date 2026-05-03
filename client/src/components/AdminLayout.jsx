import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[200px_1fr] gap-8">
      <aside className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-stone-500 mb-2 px-3">Admin</p>
        <SidebarLink to="/admin">Dashboard</SidebarLink>
        <SidebarLink to="/admin/products">Products</SidebarLink>
        <SidebarLink to="/admin/orders">Orders</SidebarLink>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm ${
          isActive ? 'bg-amber-700 text-white font-medium' : 'text-stone-700 hover:bg-stone-100'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
