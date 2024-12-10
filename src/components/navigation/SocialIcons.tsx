import { Instagram, Facebook } from 'lucide-react';

interface SocialIconsProps {
  className?: string;
}

export function SocialIcons({ className = "h-5 w-5" }: SocialIconsProps) {
  return (
    <>
      <a 
        href="https://instagram.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-light hover:text-accent transition-colors mx-2"
      >
        <Instagram className={className} />
      </a>
      <a 
        href="https://facebook.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-light hover:text-accent transition-colors mx-2"
      >
        <Facebook className={className} />
      </a>
    </>
  );
}