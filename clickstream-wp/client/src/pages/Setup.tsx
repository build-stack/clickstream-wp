import React, { useState, useEffect } from 'react';
import { getSetupData, updateSetupData, SetupData } from '../utils/api';
import Layout from '../components/Layout';
import Card from '../components/Card';

const Setup: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SetupData>({
    tracking_enabled: false,
    remote_url: '',
    environment_id: '',
    health_status: {
      live: false,
      ready: false
    }
  });

  // Fetch setup data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const setupData = await getSetupData();
        setData(setupData);
        setError(null);
      } catch (err) {
        setError('Failed to load setup data. Please try again.');
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
      const updatedData = await updateSetupData({
        remote_url: data.remote_url,
        tracking_enabled: data.tracking_enabled
      });
      
      setData(updatedData);
      setError(null);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const isHealthy = data.health_status.live && data.health_status.ready;

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <p className="mb-4 text-gray-600">Configure your tracking preferences below.</p>
        
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
          <>
            <Card className="mb-6">
              <div className="flex items-center">
                {isHealthy ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <p className="font-medium text-green-800">
                      Endpoints are healthy
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <p className="font-medium text-red-800">
                      Endpoint health check failed
                    </p>
                  </>
                )}
              </div>
            </Card>
            
            <Card>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remote URL
                    </label>
                    <input
                      type="text"
                      name="remote_url"
                      value={data.remote_url}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      The remote URL where events will be sent.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Environment ID (X-API-KEY)
                    </label>
                    {data.environment_id ? (
                      <input
                        type="text"
                        value={data.environment_id}
                        readOnly
                        className="w-full rounded-md bg-gray-100 border-gray-300 shadow-sm"
                      />
                    ) : (
                      <p className="italic text-gray-500">
                        Environment ID will be generated automatically when health checks pass.
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      This ID will be used as X-Environment-Id in API requests. Once generated, it cannot be changed.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="tracking_enabled"
                        id="tracking_enabled"
                        checked={data.tracking_enabled}
                        onChange={handleChange}
                        disabled={!isHealthy}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor="tracking_enabled" className="ml-2 block text-sm text-gray-700">
                        Enable Clickstream Tracking Framework
                      </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      When enabled, Clickstream will collect anonymous data about how users interact with your site.
                    </p>
                    {!isHealthy && (
                      <p className="mt-1 text-sm text-red-600">
                        Tracking cannot be enabled until endpoint health checks pass.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Setup; 