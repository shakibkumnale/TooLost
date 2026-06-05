import { useState, useEffect } from 'react';
import { listTrackSales, listReleaseSales, listArtistSales, listChannelSales, listTerritories as listSalesTerritories, listStreamRates } from '../lib/endpoints';
import DataTable from '../components/DataTable';
import { DollarSign, Music2, Disc3, Users, Radio, Globe, TrendingUp } from 'lucide-react';

// ── Track Sales ───────────────────────────

export function SalesTrackList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listTrackSales({ page, perPage: 20 });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  return (
    <DataTable
      loading={loading}
      data={data}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      emptyMessage="No track sales data available"
      columns={[
        { key: 'title', label: 'Track', render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Music2 size={16} style={{ color: 'var(--brand-accent)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{row.title || row.name || `Track #${row.id}`}</span>
          </div>
        )},
        { key: 'streams', label: 'Streams', render: (row) => (
          <span className="mono">{(row.streams || row.totalStreams || 0).toLocaleString()}</span>
        )},
        { key: 'revenue', label: 'Revenue', render: (row) => (
          <span className="mono" style={{ color: 'var(--emerald)' }}>
            ${(row.revenue || row.totalRevenue || 0).toFixed(2)}
          </span>
        )},
      ]}
    />
  );
}

// ── Release Sales ─────────────────────────

export function SalesReleaseList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listReleaseSales({ page, perPage: 20 });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  return (
    <DataTable
      loading={loading}
      data={data}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      emptyMessage="No release sales data available"
      columns={[
        { key: 'title', label: 'Release', render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Disc3 size={16} style={{ color: 'var(--brand-accent)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{row.title || row.name || `Release #${row.id}`}</span>
          </div>
        )},
        { key: 'type', label: 'Type', render: (row) => (
          <span style={{ color: 'var(--text-secondary)' }}>{row.type || '—'}</span>
        )},
        { key: 'streams', label: 'Streams', render: (row) => (
          <span className="mono">{(row.streams || row.totalStreams || 0).toLocaleString()}</span>
        )},
        { key: 'revenue', label: 'Revenue', render: (row) => (
          <span className="mono" style={{ color: 'var(--emerald)' }}>
            ${(row.revenue || row.totalRevenue || 0).toFixed(2)}
          </span>
        )},
      ]}
    />
  );
}

// ── Artist Sales ──────────────────────────

export function SalesArtistList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listArtistSales({ page, perPage: 20 });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  return (
    <DataTable
      loading={loading}
      data={data}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      emptyMessage="No artist sales data available"
      columns={[
        { key: 'name', label: 'Artist', render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={16} style={{ color: 'var(--brand-accent)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{row.name || `Artist #${row.id}`}</span>
          </div>
        )},
        { key: 'streams', label: 'Streams', render: (row) => (
          <span className="mono">{(row.streams || row.totalStreams || 0).toLocaleString()}</span>
        )},
        { key: 'revenue', label: 'Revenue', render: (row) => (
          <span className="mono" style={{ color: 'var(--emerald)' }}>
            ${(row.revenue || row.totalRevenue || 0).toFixed(2)}
          </span>
        )},
      ]}
    />
  );
}

// ── Channel Sales ─────────────────────────

export function SalesChannelList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await listChannelSales({ page, perPage: 20 });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  return (
    <DataTable
      loading={loading}
      data={data}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      emptyMessage="No channel sales data available"
      columns={[
        { key: 'name', label: 'Channel', render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Radio size={16} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{row.name || row.channel || `Channel #${row.id}`}</span>
          </div>
        )},
        { key: 'streams', label: 'Streams', render: (row) => (
          <span className="mono">{(row.streams || row.totalStreams || 0).toLocaleString()}</span>
        )},
        { key: 'revenue', label: 'Revenue', render: (row) => (
          <span className="mono" style={{ color: 'var(--emerald)' }}>
            ${(row.revenue || row.totalRevenue || 0).toFixed(2)}
          </span>
        )},
      ]}
    />
  );
}

// ── Territories ───────────────────────────

export function SalesTerritories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await listSalesTerritories();
        setData(res.data || []);
      } catch { setData([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <DataTable
      loading={loading}
      data={data}
      currentPage={1}
      totalPages={1}
      onPageChange={() => {}}
      emptyMessage="No territory data available"
      columns={[
        { key: 'territory', label: 'Territory', render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Globe size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{row.territory || row.country || row.name || `Territory #${row.id}`}</span>
          </div>
        )},
        { key: 'streams', label: 'Streams', render: (row) => (
          <span className="mono">{(row.streams || row.totalStreams || 0).toLocaleString()}</span>
        )},
        { key: 'revenue', label: 'Revenue', render: (row) => (
          <span className="mono" style={{ color: 'var(--emerald)' }}>
            ${(row.revenue || row.totalRevenue || 0).toFixed(2)}
          </span>
        )},
      ]}
    />
  );
}

// ── Stream Rates ──────────────────────────

export function StreamRates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await listStreamRates();
        setData(res.data || []);
      } catch { setData([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <DataTable
      loading={loading}
      data={data}
      currentPage={1}
      totalPages={1}
      onPageChange={() => {}}
      emptyMessage="No stream rate data available"
      columns={[
        { key: 'platform', label: 'Platform', render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{row.platform || row.channel || row.name || `Platform #${row.id}`}</span>
          </div>
        )},
        { key: 'rate', label: 'Rate Per Stream', render: (row) => (
          <span className="mono" style={{ color: 'var(--cyan)' }}>
            ${(row.rate || row.ratePerStream || 0).toFixed(6)}
          </span>
        )},
        { key: 'streams', label: 'Total Streams', render: (row) => (
          <span className="mono">{(row.streams || row.totalStreams || 0).toLocaleString()}</span>
        )},
        { key: 'revenue', label: 'Revenue', render: (row) => (
          <span className="mono" style={{ color: 'var(--emerald)' }}>
            ${(row.revenue || row.totalRevenue || 0).toFixed(2)}
          </span>
        )},
      ]}
    />
  );
}
