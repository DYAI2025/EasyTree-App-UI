import React from 'react';

interface HexBadgeProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'wood' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const HexBadge: React.FC<HexBadgeProps> = ({
  label,
  icon,
  variant = 'wood',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-xs font-semibold px-3 py-1.5 gap-1.5',
    lg: 'text-sm font-semibold px-4 py-2 gap-2'
  }[size];

  const variantStyles = {
    wood: 'bg-[#272822] text-[#D6A875] border border-[#49372B] shadow-xs',
    primary: 'bg-[#55735B] text-[#F1E8DC] border border-[#7D8B55]',
    dark: 'bg-[#141713] text-[#C2B3A0] border border-[#34332D]'
  }[variant];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg ${sizeClasses} ${variantStyles}`}
      style={{
        clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
      }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate tracking-wide">{label}</span>
    </div>
  );
};
