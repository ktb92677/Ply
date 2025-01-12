import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
  duration?: number;
}

export function Toast({ message, onClose, type = 'success', duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out',
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : null}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-black/10 rounded-full"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 