
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LinkProps extends RouterLinkProps {
  className?: string;
  children: React.ReactNode;
}

const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn("text-blue-600 hover:text-blue-800 hover:underline", className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export { Link };
