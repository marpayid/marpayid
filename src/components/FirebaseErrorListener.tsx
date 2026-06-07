'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      console.error('Contextual Firestore Error:', error);
      toast({
        variant: "destructive",
        title: "Akses Firestore Ditolak",
        description: `Anda tidak memiliki izin untuk ${error.context.operation} pada ${error.context.path}. Periksa Security Rules.`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.removeListener('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
