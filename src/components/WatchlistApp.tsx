'use client';

import { useState } from 'react';
import { PlusCircle, Check, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Show, FilterType } from '@/types/show';

export default function WatchlistApp() {
  const [shows, setShows] = useLocalStorage<Show[]>('watchlist', []);
  const [newShow, setNewShow] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addShow = (e: React.FormEvent) => {
    e.preventDefault();
    if (newShow.trim()) {
      if (shows.some((show: Show) => show.title.toLowerCase() === newShow.trim().toLowerCase())) {
        alert('This show is already in your list!');
        return;
      }
      
      setShows((prev: Show[]) => [{
        id: crypto.randomUUID(),
        title: newShow.trim(),
        watched: false,
        addedAt: new Date().toISOString()
      }, ...prev]);
      
      setNewShow('');
    }
  };

  const toggleWatched = (id: string) => {
    setShows(shows.map((show: Show) => 
      show.id === id ? { ...show, watched: !show.watched } : show
    ));
  };

  const deleteShow = (id: string) => {
    if (window.confirm('Remove this show from your list?')) {
      setShows(shows.filter((show: Show) => show.id !== id));
    }
  };

  const filteredShows = shows.filter((show: Show) => {
    if (filter === 'watched') return show.watched;
    if (filter === 'unwatched') return !show.watched;
    return true;
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
      
      <form onSubmit={addShow} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newShow}
            onChange={(e) => setNewShow(e.target.value)}
            placeholder="Add a show or movie..."
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            maxLength={100}
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={!newShow.trim()}
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {shows.length} shows ({shows.filter((s: Show) => s.watched).length} watched)
        </div>
        
        <div className="flex gap-2">
          {(['all', 'watched', 'unwatched'] as const).map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredShows.map((show) => (
          <div 
            key={show.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
          >
            <span className={show.watched ? 'line-through text-gray-500' : ''}>
              {show.title}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleWatched(show.id)}
                className={`p-1 rounded hover:bg-gray-200 ${
                  show.watched ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <Check className="w-5 h-5" /> 
              </button>
              <button
                onClick={() => deleteShow(show.id)}
                className="p-1 text-red-500 rounded hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Your watchlist is empty. Add your first show above!
        </div>
      )}
    </div>
  );
}