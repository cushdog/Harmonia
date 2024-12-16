import toast from 'react-hot-toast';
import { useTheme } from '@/lib/Theming/theme-provider';

export const useCustomToast = () => {
  const { theme } = useTheme();

  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        background: theme === 'dark' ? '#1f2937' : '#4caf50',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      style: {
        background: theme === 'dark' ? '#991b1b' : '#f44336',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
      },
    });
  };

  return {
    success: showSuccess,
    error: showError,
  };
};