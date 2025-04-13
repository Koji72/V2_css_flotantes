import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/floating-elements-demo');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <p>Redireccionando a la demostración...</p>
    </div>
  );
} 