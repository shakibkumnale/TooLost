import { fetchTooLost } from '@/lib/toolost-api';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const response = await fetchTooLost(`/releases/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ message: errorText || 'Failed to fetch release details' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error(`Error fetching release ${id}:`, err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const response = await fetchTooLost(`/releases/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ message: errorText || 'Failed to delete release draft' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error(`Error deleting release ${id}:`, err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
