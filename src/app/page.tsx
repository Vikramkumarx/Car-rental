'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import {
  FaSearch, FaStar, FaChair, FaDoorOpen, FaSuitcase,
  FaTimes, FaCalendarAlt, FaPhone, FaUser, FaHeart, FaRegHeart, FaCheckCircle
} from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';

/* --- Data Types --- */
interface Car {
  id: number;
  name: string;
  rating: number;
  year: number;
  category: string;
  seats: number;
  doors: number;
  bags: number;
  price: number;
  image: string;
}

interface Booking {
  id: string;
  car: Car;
  startDate: string;
  endDate: string;
  status: 'Confirmed' | 'Completed';
}

/* --- Mock Data --- */
const ALL_VEHICLES: Car[] = [
  { id: 1, name: 'Toyota Fortuner', rating: 4.8, year: 2024, category: 'Gadiya', seats: 7, doors: 5, bags: 4, price: 4500, image: '/bmw_car_img.png' },
  { id: 2, name: 'Mahindra Scorpio N', rating: 4.7, year: 2023, category: 'Gadiya', seats: 7, doors: 5, bags: 5, price: 3500, image: '/mercedes.png' },
  { id: 3, name: 'Hyundai Verna', rating: 4.6, year: 2023, category: 'Gadiya', seats: 5, doors: 4, bags: 3, price: 2500, image: '/audi.png' },
  { id: 4, name: 'DC Avanti', rating: 4.5, year: 2022, category: 'Gadiya', seats: 2, doors: 2, bags: 2, price: 8000, image: '/ford_mustang.png' },
  { id: 5, name: 'Royal Enfield Classic', rating: 4.9, year: 2023, category: 'Bikes', seats: 2, doors: 0, bags: 1, price: 1200, image: '/show_bikes_img.png' },
  { id: 6, name: 'KTM Duke 390', rating: 4.7, year: 2024, category: 'Bikes', seats: 2, doors: 0, bags: 0, price: 1500, image: '/show_bikes_img.png' },
  { id: 7, name: 'Tata Prima', rating: 4.5, year: 2022, category: 'Trucks', seats: 2, doors: 2, bags: 20, price: 5000, image: '/bmw_car_img.png' },
];

const TABS = ['Explore', 'Gadiya', 'Bikes', 'Trucks'];

export default function Home() {
  const [activeTab, setActiveTab] = useState('Explore');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // New State Features
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    startDate: '',
    endDate: ''
  });

  // Filter Logic
  const getFilteredCars = () => {
    let cars = ALL_VEHICLES;

    // Filter by Tab
    if (activeTab !== 'Explore') {
      cars = cars.filter(car => car.category === activeTab);
    }

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      cars = cars.filter(car =>
        car.name.toLowerCase().includes(lowerQuery) ||
        car.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by Favorites Tab (if implemented, but we use a toggle button currently)
    return cars;
  };

  const filteredCars = getFilteredCars();

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const openBookingModal = (car: Car) => {
    setSelectedCar(car);
    setBookingSuccess(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
    setBookingSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    // Validate Dates
    if (new Date(bookingDetails.startDate) > new Date(bookingDetails.endDate)) {
      alert('End date must be after start date');
      return;
    }

    // Create Booking
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      car: selectedCar,
      startDate: bookingDetails.startDate,
      endDate: bookingDetails.endDate,
      status: 'Confirmed'
    };

    setBookings(prev => [newBooking, ...prev]);
    setBookingSuccess(true);
    // Don't close immediately so user sees success
  };

  const handleNavClick = (view: string) => {
    if (view === 'My Bookings') {
      setShowMyBookings(true);
      setActiveTab('Hidden'); // Hack to hide main grid or handle view switching better
    } else {
      setShowMyBookings(false);
      setActiveTab('Explore');
    }
  };

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.logoText}>CarRentIndia</span>
        </div>
        <div className={styles.navLinks}>
          <span
            className={`${styles.navLink} ${!showMyBookings ? styles.navLinkActive : ''}`}
            onClick={() => handleNavClick('Explore')}
          >
            Explore
          </span>
          <span
            className={`${styles.navLink} ${showMyBookings ? styles.navLinkActive : ''}`}
            onClick={() => handleNavClick('My Bookings')}
          >
            My Bookings {bookings.length > 0 && `(${bookings.length})`}
          </span>
          <span className={styles.navLink}>Favorites ({favorites.length})</span>
          <span className={styles.navLink}>Help</span>
        </div>
        <div className={styles.profileSection}>
          <Image
            src="/anime_avatar.png"
            alt="User"
            width={40}
            height={40}
            className={styles.profileImage}
          />
        </div>
      </nav>

      <main className={styles.main}>
        {showMyBookings ? (
          /* My Bookings View */
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>My Bookings</h1>
            {bookings.length === 0 ? (
              <p className={styles.heroSubtitle}>No bookings yet. Start exploring!</p>
            ) : (
              <div className={styles.bookingsList}>
                {bookings.map(booking => (
                  <div key={booking.id} className={styles.bookingItem}>
                    <div className={styles.bookingImage}>
                      <Image src={booking.car.image} alt={booking.car.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.bookingInfo}>
                      <div className={styles.bookingTitle}>{booking.car.name}</div>
                      <div className={styles.bookingDate}>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={styles.bookingStatus}>
                      {booking.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Explore View */
          <>
            {/* Hero */}
            <div className={styles.heroSection}>
              <h1 className={styles.heroTitle}>Find Your Perfect Ride 🇮🇳</h1>
              <p className={styles.heroSubtitle}>From city streets to mountain roads, rent the best vehicles at affordable prices.</p>
            </div>

            {/* Controls */}
            <section className={styles.controlsBar}>
              <div className={styles.tabs}>
                {TABS.map((tab) => (
                  <div
                    key={tab}
                    className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by name, brand..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </section>

            {/* Cars Grid */}
            <div className={styles.carGrid}>
              {filteredCars.length > 0 ? filteredCars.map((car) => (
                <div key={car.id} className={styles.card}>
                  <button
                    className={styles.favoriteBtn}
                    onClick={(e) => toggleFavorite(e, car.id)}
                  >
                    {favorites.includes(car.id) ?
                      <FaHeart color="#ef4444" size={18} /> :
                      <FaRegHeart color="#9ca3af" size={18} />
                    }
                  </button>

                  <div className={styles.cardHeader}>
                    <div>
                      <span className={styles.carCategory}>{car.category}</span>
                      <h2 className={styles.carName}>{car.name}</h2>
                    </div>
                    <div className={styles.rating}>
                      <FaStar size={14} />
                      <span>{car.rating}</span>
                    </div>
                  </div>

                  <div className={styles.imageContainer}>
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>

                  <div className={styles.specsGrid}>
                    <div className={styles.specItem}>
                      <FaChair className={styles.specIcon} />
                      <span className={styles.specLabel}>{car.seats} Seats</span>
                    </div>
                    <div className={styles.specItem}>
                      <FaDoorOpen className={styles.specIcon} />
                      <span className={styles.specLabel}>{car.doors} Doors</span>
                    </div>
                    <div className={styles.specItem}>
                      <FaSuitcase className={styles.specIcon} />
                      <span className={styles.specLabel}>{car.bags} Bags</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.pricePerDay}>
                      <span className={styles.price}>₹{car.price.toLocaleString()}</span>
                      <span className={styles.duration}>/day</span>
                    </div>
                    <button
                      className={styles.bookButton}
                      onClick={() => openBookingModal(car)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  No vehicles found matching "{searchQuery}" in {activeTab}.
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Booking Modal */}
      {isModalOpen && selectedCar && (
        <div className={styles.modalOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              <FaTimes />
            </button>

            {!bookingSuccess ? (
              <>
                <h2 className={styles.modalTitle}>Book {selectedCar.name}</h2>
                <p className={styles.modalSubtitle}>Please enter your details to confirm booking.</p>

                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <FaUser style={{ position: 'absolute', top: 15, left: 16, color: '#9ca3af' }} />
                      <input
                        type="text"
                        name="name"
                        required
                        className={styles.input}
                        style={{ paddingLeft: 44 }}
                        placeholder="Enter your name"
                        value={bookingDetails.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <FaPhone style={{ position: 'absolute', top: 15, left: 16, color: '#9ca3af' }} />
                      <input
                        type="tel"
                        name="phone"
                        required
                        className={styles.input}
                        style={{ paddingLeft: 44 }}
                        placeholder="+91 98765 43210"
                        value={bookingDetails.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        required
                        className={styles.input}
                        value={bookingDetails.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        required
                        className={styles.input}
                        value={bookingDetails.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Confirm Booking
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successView}>
                <div className={styles.successIcon}>
                  <FaCheckCircle />
                </div>
                <h2 className={styles.successTitle}>Booking Confirmed!</h2>
                <p className={styles.successMessage}>
                  Your ride is ready. We have sent the details to your phone.
                </p>

                <div className={styles.bookingSummary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Vehicle</span>
                    <span className={styles.summaryValue}>{selectedCar.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Total Days</span>
                    <span className={styles.summaryValue}>
                      {Math.max(1, Math.ceil((new Date(bookingDetails.endDate).getTime() - new Date(bookingDetails.startDate).getTime()) / (1000 * 3600 * 24)))} Days
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Total Amount</span>
                    <span className={styles.summaryValue} style={{ color: '#3f9dff', fontSize: '18px' }}>
                      ₹{(selectedCar.price * Math.max(1, Math.ceil((new Date(bookingDetails.endDate).getTime() - new Date(bookingDetails.startDate).getTime()) / (1000 * 3600 * 24)))).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button className={styles.submitButton} onClick={closeModal}>
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
