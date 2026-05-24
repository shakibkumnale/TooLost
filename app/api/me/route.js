import { fetchTooLost } from '@/lib/toolost';

export const dynamic = 'force-dynamic';


export async function GET(request) {
  try {
    const response = await fetchTooLost('/me');
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ message: errorText || 'Failed to fetch profile' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error('Error fetching /me:', err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
