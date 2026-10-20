'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');

  const [photoTitle, setPhotoTitle] = useState('');
  const [photoPrice, setPhotoPrice] = useState('');
  const [photoType, setPhotoType] = useState('Indoor');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
      setIsLoggedIn(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    // 1. Try loading from Supabase first
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setBookings(data);
        } else {
          // Fallback to local storage
          const localBookings = JSON.parse(localStorage.getItem('local_bookings') || '[]');
          setBookings(localBookings);
        }
      }
    } catch (e) {
      const localBookings = JSON.parse(localStorage.getItem('local_bookings') || '[]');
      setBookings(localBookings);
    }

    const localPhotos = JSON.parse(localStorage.getItem('local_gallery') || '[]');
    setPhotos(localPhotos);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('admin_session', 'true');
      setLoginError('');
      loadData();
    } else {
      setLoginError('Invalid Username or Password!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!photoUrl) {
      alert('Please choose an image or enter a URL!');
      return;
    }

    const newPhoto = {
      id: Date.now(),
      title: photoTitle || 'Special Setup',
      price: photoPrice || '₹1,00,000 / Day',
      type: photoType,
      capacity: '500+ Guests',
      desc: 'Beautiful venue setup.',
      url: photoUrl
    };

    const updated = [newPhoto, ...photos];
    localStorage.setItem('local_gallery', JSON.stringify(updated));
    setPhotos(updated);

    setPhotoTitle('');
    setPhotoPrice('');
    setPhotoUrl('');
    alert('🎉 Photo added to Gallery successfully!');
  };

  const handleDeletePhoto = (id) => {
    if (confirm('Delete this photo?')) {
      const updated = photos.filter(p => p.id !== id);
      localStorage.setItem('local_gallery', JSON.stringify(updated));
      setPhotos(updated);
    }
  };

  const clearBookings = async () => {
    if (confirm('Clear all booking requests?')) {
      try {
        if (supabase) {
          await supabase.from('bookings').delete().neq('id', 0);
        }
      } catch (e) {}
      localStorage.removeItem('local_bookings');
      setBookings([]);
    }
  };

  const filteredBookings = bookings.filter((item) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;

    const nameMatch = item.full_name?.toLowerCase().includes(query);
    const phoneMatch = item.phone?.toLowerCase().includes(query);
    const aadharMatch = item.aadhar?.toLowerCase().includes(query);
    const eventMatch = item.event_type?.toLowerCase().includes(query);

    return nameMatch || phoneMatch || aadharMatch || eventMatch;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-bold text-amber-400 mt-2">Admin Portal</h1>
            <p className="text-slate-400 text-xs mt-1">Authorized personnel only</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-4 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-3 rounded-lg transition text-sm mt-2"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-amber-400 transition">
              ← Return to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-400">👑 Hall Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Manage bookings & gallery photos</p>
          </div>
          <div className="flex gap-3 items-center">
            <a href="/" className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition">
              🌐 Live Website
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg border border-red-500/20 transition"
            >
              🔒 Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📋 Booking Requests ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'gallery'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🖼️ Gallery Manager ({photos.length})
          </button>
        </div>

        {/* TAB 1: BOOKING REQUESTS */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-200">Recent Booking Inquiries</h2>
              {bookings.length > 0 && (
                <button 
                  onClick={clearBookings}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold px-3 py-1.5 rounded border border-red-500/20 transition"
                >
                  🗑️ Clear All Bookings
                </button>
              )}
            </div>

            {/* Search Input Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search by Name, Phone, Aadhaar, or Event Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-white"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-slate-400">No booking requests available yet.</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-slate-400">No bookings match your search query "{searchTerm}".</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBookings.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-amber-500/40 transition">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-white">{item.full_name}</span>
                        <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-0.5 rounded border border-amber-500/20 font-medium">
                          {item.event_type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">
                        📞 Phone: <span className="text-slate-200 font-mono mr-4">{item.phone}</span>
                        🪪 Aadhaar: <span className="text-slate-200 font-mono">{item.aadhar || 'N/A'}</span>
                      </p>
                      {item.created_at && (
                        <p className="text-xs text-slate-500 mt-1">
                          📅 Order Placed On: <span className="text-slate-400">{new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      )}
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-500 block">Target Event Date</span>
                      <span className="text-amber-400 font-semibold">{item.event_date || item.start_date || 'Not specified'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4">➕ Add New Photo</h3>
              
              <form onSubmit={handleAddPhoto} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Title / Hall Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Stage Decoration"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Price / Rate</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹1,10,000 / Day"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                      value={photoPrice}
                      onChange={(e) => setPhotoPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Select Local Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">OR Paste Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                  </div>
                </div>

                {photoUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-slate-400 mb-1">Preview:</p>
                    <img src={photoUrl} alt="Preview" className="h-32 rounded-lg object-cover border border-slate-700" />
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
                >
                  Upload & Save to Website
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-300 mb-4">Your Custom Uploaded Photos</h3>
              {photos.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No custom photos added yet.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {photos.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3 relative group">
                      <img src={item.url} alt={item.title} className="w-full h-36 object-cover rounded-lg mb-2" />
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                      <p className="text-xs text-amber-400">{item.price}</p>
                      
                      <button
                        onClick={() => handleDeletePhoto(item.id)}
                        className="mt-3 w-full bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs font-semibold py-1.5 rounded transition border border-red-500/30"
                      >
                        🗑️ Delete Photo
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}