'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send to Formspree
      const response = await fetch('https://formspree.io/f/xblkwzzr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `Contact Form: ${formData.subject}`,
        }),
      });

      if (response.ok) {
        // Show success message
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        alert('There was an error submitting your message. Please try again or email us directly at support@castawaycovers.com');
      }
    } catch (error) {
      alert('There was an error submitting your message. Please try again or email us directly at support@castawaycovers.com');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form or Success Message */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              
              {showSuccess ? (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-700 mb-6">
                      Thank you for contacting us! We'll get back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="text-gray-600 underline hover:text-gray-800 text-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-teal text-white px-4 py-2 rounded-md hover:bg-brand-teal-dark transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-700">support@castawaycovers.com</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                <p className="text-gray-700 text-sm">
                  We typically respond to all inquiries within 24-48 business hours. 
                  For urgent matters, please email us with "URGENT" in the subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}