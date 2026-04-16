import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: '', message: ''
    });
    
    const [status, setStatus] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since we aren't changing the backend, we will just simulate a success message
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container flex-1" style={{ marginTop: '3rem', marginBottom: '5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
                    <h1 style={{ fontSize: '3rem', color: 'var(--text-main)' }}>Contact Our Team</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Get in touch for technical assistance, partnerships, or general inquiries about our AI health predictions.
                    </p>
                </div>

                <div className="grid grid-cols-2 animate-fade-in" style={{ gap: '3rem', alignItems: 'stretch' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>General Inquiry</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Need more information about our diagnostic features? Reach out and we'll guide you.</p>
                        </div>
                        
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--secondary)' }}>Technical Support</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Encountered an issue running a protocol? Our support team is here to assist.</p>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.3rem', color: 'var(--warning)' }}>Partnerships</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Interested in integrating AutoMed AI into your clinic? Let's talk business.</p>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', marginTop: 'auto', background: 'var(--bg-glass)' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Contact Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: 'var(--primary)' }}>&rarr;</span> 
                                    <span>Email: support@automed.ai</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: 'var(--primary)' }}>&rarr;</span> 
                                    <span>Phone: +91-XXXXXXXXXX</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: 'var(--primary)' }}>&rarr;</span> 
                                    <span>Website: automed.ai</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="glass-panel" style={{ padding: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Send a Message</h2>
                        {status === 'success' && (
                            <div className="status-low" style={{ marginBottom: '1.5rem', width: '100%', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                                Message sent successfully! We'll get back to you soon.
                            </div>
                        )}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. John Doe" />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>

                            <div>
                                <label>Subject</label>
                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" />
                            </div>

                            <div>
                                <label>Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Please describe your inquiry in detail..."></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
