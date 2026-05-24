import { fetchTooLost } from '@/lib/toolost';

export const dynamic = 'force-dynamic';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'artists'; // e.g. artists, label-preferences, spotify-search
    
    let apiPath = `/preferences/${endpoint}`;
    if (endpoint === 'spotify-search') {
      apiPath = `/preferences/spotify?search=${searchParams.get('q') || ''}`;
    } else if (endpoint === 'apple-search') {
      apiPath = `/preferences/apple-music?search=${searchParams.get('q') || ''}`;
    } else if (endpoint === 'youtube-search') {
      apiPath = `/preferences/youtube?search=${searchParams.get('q') || ''}`;
    } else {
      // General copy of search params
      const query = new URLSearchParams(searchParams);
      query.delete('endpoint');
      apiPath = `/preferences/${endpoint}?${query.toString()}`;
    }

    const response = await fetchTooLost(apiPath);
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ message: errorText || `Failed to fetch preferences: ${endpoint}` }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error('Error fetching artist preferences:', err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'artists'; // artists, labels
    
    const response = await fetchTooLost(`/preferences/${endpoint}`, {
      method: 'POST',
      body: body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error('Error posting artist preferences:', err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
