export * from './sessionRecordings';

export const updateSetupData = async (data: any) => {
  console.log('Would update setup data:', data);
  return {
    ...data,
    environment_id: data.remote_url ? 'env_123456789' : '',
    health_status: {
      live: !!data.remote_url,
      ready: !!data.remote_url
    }
  };
};

export const getPrivacyData = async () => {
  return {
    anonymize_ip: true,
    data_retention: 30,
    cookie_notice: 'This site uses cookies to improve your experience.'
  };
};

export const updatePrivacyData = async (data: any) => {
  console.log('Would update privacy data:', data);
  return data;
}; 