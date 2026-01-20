import React, { useState, useRef } from 'react';

type DropdownMenuProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary';
};

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  children, 
  className, 
  variant = 'default' 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', isActive: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', isActive: false }
  ];

  return (
    <div 
      ref={dropdownRef}
      className={`dropdown ${className || ''}`}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button className={`btn btn-${variant}`}>
        {children}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {users.map((user) => (
            <div key={user.id} className="dropdown-item">
              <span>{user.name}</span>
              <span className="email">{user.email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
