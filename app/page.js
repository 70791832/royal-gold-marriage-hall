'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure your Supabase client import path is correct

const DEFAULT_PHOTOS = [
  {
    id: 'def1',
    title: 'Royal AC Banquet Hall',
    type: 'Indoor',
    capacity: '1200 Guests',
    price: '₹1,50,000 / Day',
    desc: 'Crystal Chandeliers, Luxury Stage Setup, Centralized AC.',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'def2',
    title: 'Emerald Marriage Garden',
    type: 'Outdoor Lawn',
    capacity: '800 Guests',
    price: '₹1,20,000 / Day',
    desc: 'Lush Green Garden, Open-Air Dining, Dynamic Evening Lighting.',
    url: 'https://images.unsplash.com/photo-1545232979-fbf34d3b6643?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'def3',
    title: 'Luxury Hotel Rooms',
    type: 'Stay / Accommodation',
    capacity: '2 Guests / Room',
    price: '₹2,500 / Night',
    desc: 'Fully furnished AC Deluxe Rooms with modern amenities for event guests.',
    url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
  }
];

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    aadhar: '',
    eventType: 'Marriage / Wedding',
    eventDate: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const customPhotos = JSON.parse(localStorage.getItem('local_gallery') || '[]');
    setGallery([...DEFAULT_PHOTOS, ...customPhotos]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingPayload = {
      full_name: formData.fullName,
      phone: formData.phone,
      aadhar: formData.aadhar,
      event_type: formData.eventType,
      event_date: formData.eventDate,
      created_at: new Date().toISOString(),
    };

    // Save to Supabase database
    try {
      if (supabase) {
        await supabase.from('bookings').insert([bookingPayload]);
      }
    } catch (err) {
      console.error('Supabase error:', err);
    }

    // Fallback/Local sync
    const existing = JSON.parse(localStorage.getItem('local_bookings') || '[]');
    existing.unshift({ id: Date.now(), ...bookingPayload });
    localStorage.setItem('local_bookings', JSON.stringify(existing));

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Top Banner Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-6 text-center text-xs text-amber-400 font-medium">
        📍 Address: Lauriya Road, Ramnagar | 📞 For Booking Contact: 9905597097 / 7762905430
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 w-full z-50">
        <div className="text-xl font-bold tracking-wide text-amber-400 flex items-center gap-2">
          👑 Royal Gold <span className="text-xs text-slate-300 font-normal">Hotel & Marriage Garden</span>
        </div>
        <div className="flex gap-6 text-sm font-medium items-center">
          <a href="#about" className="hover:text-amber-400 transition hidden md:inline">About Us</a>
          <a href="#services" className="hover:text-amber-400 transition hidden md:inline">Services</a>
          <a href="#halls" className="hover:text-amber-400 transition hidden md:inline">Gallery</a>
          <a href="#booking" className="hover:text-amber-400 transition hidden md:inline">Book Now</a>
          <a href="/admin" className="text-amber-400 border border-amber-400/40 px-3 py-1.5 rounded-lg hover:bg-amber-400/10 transition font-semibold text-xs">
            🔑 Admin Panel
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <span className="text-amber-400 text-xs md:text-sm font-semibold tracking-wider uppercase bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
          ✨ Royal Gold Hotel & Marriage Garden ✨
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold mt-6 leading-tight text-white">
          Grand Arrangements For All Your Ceremonies
        </h1>
        <p className="mt-4 text-slate-400 text-base md:text-lg">
          The best venue for Weddings, Engagements, Birthdays, Anniversaries, Corporate Events, and all other celebrations.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a href="tel:9905597097" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition text-sm flex items-center gap-2">
            📞 Call Us: 9905597097
          </a>
          <a href="#booking" className="bg-slate-900 border border-amber-500/40 hover:bg-slate-800 text-amber-400 font-bold px-6 py-3 rounded-xl transition text-sm">
            📅 Book Now
          </a>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-12 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400">
              Our Services & Facilities
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              We offer premium arrangements to make every occasion memorable
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-amber-500/30 transition">
              <div className="text-3xl mb-3">💍</div>
              <h3 className="text-lg font-bold text-white mb-2">Weddings & Engagements</h3>
              <p className="text-xs text-slate-400">AC Hall and Marriage Garden featuring grand stages, Mandap, and beautiful decorations.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-amber-500/30 transition">
              <div className="text-3xl mb-3">🎂</div>
              <h3 className="text-lg font-bold text-white mb-2">Birthdays & Anniversaries</h3>
              <p className="text-xs text-slate-400">Custom theme decorations tailored for family parties and special celebrations.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-amber-500/30 transition">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-lg font-bold text-white mb-2">Corporate Events</h3>
              <p className="text-xs text-slate-400">Professional ambiance equipped for business meetings, seminars, and conferences.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-amber-500/30 transition">
              <div className="text-3xl mb-3">🏨</div>
              <h3 className="text-lg font-bold text-white mb-2">Hotel & Stay Rooms</h3>
              <p className="text-xs text-slate-400">Comfortable and luxurious AC rooms for guest accommodation.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-amber-500/30 transition">
              <div className="text-3xl mb-3">🍽️</div>
              <h3 className="text-lg font-bold text-white mb-2">Catering Service</h3>
              <p className="text-xs text-slate-400">Delicious and hygienic catering services with vegetarian and multi-cuisine options.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center hover:border-amber-500/30 transition">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="text-lg font-bold text-white mb-2">Spacious Parking</h3>
              <p className="text-xs text-slate-400">Ample open parking space to safely accommodate guest vehicles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Halls Showcase */}
      <section id="halls" className="py-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-amber-400 mb-2">Royal Gold Gallery</h2>
        <p className="text-slate-400 text-center text-sm mb-10">Photos of our hall, marriage garden, and hotel rooms</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition">
              <div className="h-56 bg-slate-800 flex items-center justify-center relative overflow-hidden group">
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Royal+Gold'; }}
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <span className="text-xs bg-amber-400/10 text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-400/20">
                    {item.type || 'Special'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mb-4 line-clamp-2">{item.desc || 'Royal Gold Hotel & Marriage Garden'}</p>
                <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-800">
                  <span className="text-slate-400">{item.capacity || 'For Events'}</span>
                  <span className="font-bold text-amber-400 text-base">{item.price || 'Contact Us'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-16 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-amber-400 mb-2">Online Booking Inquiry</h2>
            <p className="text-xs text-slate-400 text-center mb-6">Fill out the form below to check availability and reserve your date</p>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-xl text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="font-bold text-lg">Booking Request Received!</h3>
                <p className="text-sm text-slate-300 mt-1 mb-4">The Royal Gold team will contact you shortly at <b>{formData.phone}</b>.</p>
                <a href="/admin" className="text-xs text-amber-400 underline hover:text-amber-300">View in Admin Panel →</a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Aadhaar Number</label>
                    <input
                      type="text"
                      required
                      maxLength="12"
                      pattern="\d{12}"
                      placeholder="12-digit Aadhaar No."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      value={formData.aadhar}
                      onChange={(e) => setFormData({ ...formData, aadhar: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Event Type</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    >
                      <option value="Marriage / Wedding">Marriage / Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Other Function">Other Function</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-3 rounded-lg transition mt-4 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Send Booking Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="about" className="border-t border-slate-800 py-8 bg-slate-950 text-center text-slate-400 text-xs">
        <div className="max-w-4xl mx-auto px-6 space-y-3">
          <p className="text-base font-bold text-amber-400">👑 Royal Gold Hotel & Marriage Garden</p>
          <p>📍 Address: Lauriya Road, Ramnagar</p>
          <p>📞 Contact: 9905597097 / 7762905430</p>
          <p className="text-slate-600 pt-4">© {new Date().getFullYear()} Royal Gold Hotel & Marriage Garden. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}