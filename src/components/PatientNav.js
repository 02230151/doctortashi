import NavLink from './NavLink';

const PatientNav = ({ isMobile = false, onLinkClick = () => {} }) => {
  const linkClass = isMobile ? 'block py-2' : '';
  const links = [
    { href: '/stories', label: 'Stories' },
    { href: '/share-story', label: 'Share Your Story' },
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

export default PatientNav; 