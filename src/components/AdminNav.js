import NavLink from './NavLink';

const AdminNav = ({ isMobile = false, onLinkClick = () => {} }) => {
  const linkClass = isMobile ? 'block py-2' : '';
  const links = [
    { href: '/manage-users', label: 'Manage Users' },
    { href: '/doctor-applications', label: 'Doctor Applications' }
  ];

  return (
    <div className={isMobile ? 'space-y-2' : 'hidden md:flex gap-6'}>
      {links.map(({ href, label }) => (
        <NavLink 
          key={href} 
          href={href} 
          className={linkClass}
          onClick={onLinkClick}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default AdminNav; 