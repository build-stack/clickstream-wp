import React, { useState, useEffect } from 'react';
import { getPrivacyData, updatePrivacyData, PrivacyData } from '../utils/api';

const Privacy: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PrivacyData>({
    anonymize_ip: true,
    data_retention: 30,
    cookie_notice: ''
  });

  // Fetch privacy data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const privacyData = await getPrivacyData();
        setData(privacyData);
        setError(null);
      } catch (err) {
        setError('Failed to load privacy data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const updatedData = await updatePrivacyData(data);
      setData(updatedData);
      setError(null);
    } catch (err) {
      setError('Failed to save privacy settings. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Settings</h1>
      <p className="mb-4">Configure privacy settings and compliance options.</p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-4">Data Collection Policy</h2>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="anonymize_ip"
                  id="anonymize_ip"
                  checked={data.anonymize_ip}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <label htmlFor="anonymize_ip" className="ml-2 block text-sm text-gray-700">
                  Anonymize IP Addresses
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                When enabled, the last octet of IP addresses will be removed to enhance privacy.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention Period (days)
              </label>
              <input
                type="number"
                name="data_retention"
                value={data.data_retention}
                onChange={handleChange}
                min="1"
                max="365"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Specify how long user data should be stored before automatic deletion.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cookie Notice Text
              </label>
              <textarea
                name="cookie_notice"
                value={data.cookie_notice}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                This text will be displayed in the cookie consent notification to visitors.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Privacy; 