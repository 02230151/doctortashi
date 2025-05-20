import NavLink from './NavLink';

const DoctorNav = ({ isMobile = false, onLinkClick = () => {} }) => {
  const linkClass = isMobile ? 'block py-2' : '';
  const links = [
    { href: '/verify-stories', label: 'Verify Stories' },
    { href: '/about', label: 'About Us' }
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

export default DoctorNav; 