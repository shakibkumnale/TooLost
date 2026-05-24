import { fetchTooLost } from '@/lib/toolost';

export async function PATCH(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const response = await fetchTooLost(`/releases/${id}/delivery`, {
      method: 'PATCH',
      body: body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err) {
    console.error(`Error updating delivery for release ${id}:`, err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
