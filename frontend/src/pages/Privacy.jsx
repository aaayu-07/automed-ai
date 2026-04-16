import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container flex-1" style={{ marginTop: '3rem', marginBottom: '5rem', maxWidth: '900px' }}>
                <div className="animate-fade-in mb-8">
                    <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Last updated: March 2026</p>
                </div>

                <div className="glass-panel animate-fade-in" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', animationDelay: '0.1s' }}>
                    
                    <section>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>1. Introduction</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            Welcome to AutoMed AI. We respect your privacy and are committed to protecting your personal data and health information. This privacy policy will inform you as to how we look after your data when you visit our application and use our diagnostic prediction protocols, and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>2. Data Collection</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '1rem' }}>
                            We may collect, use, store and transfer different kinds of personal data and clinical biomarkers about you which we have grouped together as follows:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem', paddingLeft: '2rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><strong style={{ color: 'var(--text-main)' }}>Identity Data:</strong> includes first name, last name, username.</li>
                            <li><strong style={{ color: 'var(--text-main)' }}>Contact Data:</strong> includes email address and telephone numbers.</li>
                            <li><strong style={{ color: 'var(--text-main)' }}>Health Data:</strong> includes metrics inputted into our protocols (e.g., BMI, Glucose, Blood Pressure, Cholesterol levels).</li>
                            <li><strong style={{ color: 'var(--text-main)' }}>Usage Data:</strong> includes information about how you use our website, products, and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>3. How We Use Data</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            We will only use your personal configuration and health data when the law allows us to. Most commonly, we use your data to power the AI models that generate risk prediction assessments. The inputted clinical markers are securely transmitted to our backend inference engines and analyzed instantaneously. Anonymized data may occasionally be used to re-calibrate and refine our machine learning algorithms.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>4. Data Security</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a clinical or business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>5. User Rights</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to request access, correction, erasure (the 'right to be forgotten'), or restriction of processing of your stored medical inputs and resultant predictions within your History dashboard. Keep in mind that deleting history cannot be undone.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>6. Contact Information</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                            If you have any questions about this privacy policy or our privacy practices, please contact our data stewardship team at: <br/><br/>
                            <strong style={{ color: 'var(--text-main)' }}>Email:</strong> privacy@automed.ai <br/>
                            <strong style={{ color: 'var(--text-main)' }}>Mailing Address:</strong> Legal Department, AutoMed AI Technologies.
                        </p>
                    </section>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Privacy;
