'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReleaseCard from '@/components/ui/ReleaseCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Music, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function Releases() {
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadReleases() {
      try {
        setLoading(true);
        // Build api path with query params
        const params = new URLSearchParams();
        if (statusFilter !== 'all') {
          params.set('status', statusFilter);
        }
        if (search) {
          params.set('search', search);
        }

        const res = await fetch(`/api/releases?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setReleases(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load releases', err);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounceFn = setTimeout(() => {
      loadReleases();
    }, 300); // debounce searches

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  return (
    <DashboardLayout>
      <div style={containerStyle}>
        
        {/* Header Section */}
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>Release Catalog</h2>
            <p style={descStyle}>Manage and track your music, EPs, albums, and video distribution.</p>
          </div>
          <Link href="/releases/new" className="btn btn-primary">
            <Plus size={16} />
            <span>Create Release</span>
          </Link>
        </div>

        {/* Toolbar: Search and Filter */}
        <div style={toolbarStyle} className="glass">
          <div style={searchWrapperStyle}>
            <Search size={18} style={searchIconStyle} />
            <input 
              type="text" 
              placeholder="Search title, artist, catalog code..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          <div style={filterWrapperStyle}>
            <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Drafts</option>
              <option value="in_review">In Review</option>
              <option value="live">Live in Stores</option>
              <option value="takedown_pending">Takedown Pending</option>
            </select>
          </div>
        </div>

        {/* Catalog Content */}
        {loading ? (
          <div style={loadingContainerStyle}>
            <LoadingSpinner size="lg" />
          </div>
        ) : releases.length === 0 ? (
          <EmptyState 
            icon={Music}
            title={search || statusFilter !== 'all' ? "No Matches Found" : "Your Catalog is Empty"}
            description={
              search || statusFilter !== 'all' 
                ? "Try adjusting your search terms or filters to locate the release."
                : "Create a new release draft and deliver your tracks globally to platforms like Apple Music and Spotify."
            }
            actionText={search || statusFilter !== 'all' ? "Clear Filters" : "Create First Release"}
            actionOnClick={search || statusFilter !== 'all' ? () => { setSearch(''); setStatusFilter('all'); } : null}
            actionLink={search || statusFilter !== 'all' ? null : "/releases/new"}
          />
        ) : (
          <div style={gridStyle}>
            {releases.map((release) => (
              <div key={release.id} style={{ height: '100%' }}>
                <ReleaseCard release={release} />
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: '800',
  color: '#fff',
};

const descStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  marginTop: '4px',
};

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const searchWrapperStyle = {
  position: 'relative',
  flex: 1,
  maxWidth: '400px',
};

const searchIconStyle = {
  position: 'absolute',
  top: '50%',
  left: '12px',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)',
};

const searchInputStyle = {
  width: '100%',
  padding: '0.65rem 1rem 0.65rem 2.25rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  ':focus': {
    borderColor: 'var(--color-primary)',
  }
};

const filterWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const selectStyle = {
  padding: '0.65rem 1.5rem 0.65rem 0.75rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
};

const loadingContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '4rem',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1.5rem',
};
