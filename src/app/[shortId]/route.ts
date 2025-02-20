// src/app/[shortId]/page.tsx
import { redirect } from 'next/navigation';
import { getOriginalUrl } from '@/app/lib/db';

interface Props {
  params: {
    shortId: string;
  };
}

export default async function RedirectPage({ params }: Props) {
  const { shortId } = params;
  
  try {
    const originalUrl = await getOriginalUrl(shortId);
    
    if (!originalUrl) {
      redirect('/');
    }

    redirect(originalUrl);
  } catch (error) {
    console.error('Error fetching original URL:', error);
    redirect('/');
  }
}