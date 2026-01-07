
import { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-serif tracking-wide transition-all duration-200 rounded-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gold text-stone-950 hover:bg-yellow-400 font-bold shadow-lg hover:shadow-yellow-500/20",
    secondary: "bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-600 hover:border-gold",
    danger: "bg-red-900/50 text-red-200 hover:bg-red-800 border border-red-800",
    outline: "bg-transparent border border-gold text-gold hover:bg-gold/10"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg font-bold"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
