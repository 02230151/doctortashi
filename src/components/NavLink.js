import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children, className = '', onClick = () => {} }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`${
        isActive 
          ? 'text-blue-600 font-medium' 
          : 'text-gray-600 hover:text-blue-600'
      } transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink; 