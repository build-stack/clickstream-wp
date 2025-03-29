import { useState } from 'react';

interface ConfigPanelProps {
  apiKey: string;
  domain: string;
  samplingRate: number;
  onSave: (config: { apiKey: string; domain: string; samplingRate: number }) => void;
}

export function ConfigPanel({ apiKey: initialApiKey, domain: initialDomain, samplingRate: initialRate, onSave }: ConfigPanelProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [domain, setDomain] = useState(initialDomain);
  const [samplingRate, setSamplingRate] = useState(initialRate);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave({ apiKey, domain, samplingRate });
    setIsEditing(false);
  };

  return (
    <div className="config-panel">
      <div className="panel-header">
        <h2>Configuration</h2>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Settings
          </button>
        )}
      </div>

      <div className="panel-content">
        <div className="config-group">
          <label>API Key</label>
          {isEditing ? (
            <input
              type="text"
              className="form-control"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          ) : (
            <div className="config-value">
              <code>{apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : 'Not configured'}</code>
            </div>
          )}
        </div>

        <div className="config-group">
          <label>Domain</label>
          {isEditing ? (
            <input
              type="text"
              className="form-control"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., example.com"
            />
          ) : (
            <div className="config-value">{domain || 'Not configured'}</div>
          )}
        </div>

        <div className="config-group">
          <label>Sampling Rate</label>
          {isEditing ? (
            <div className="sampling-input">
              <input
                type="range"
                min="1"
                max="100"
                value={samplingRate}
                onChange={(e) => setSamplingRate(Number(e.target.value))}
              />
              <span className="sampling-value">{samplingRate}%</span>
            </div>
          ) : (
            <div className="config-value">{samplingRate}% of traffic</div>
          )}
          <p className="help-text">
            Percentage of visitors to track. Lower values reduce server load.
          </p>
        </div>

        {isEditing && (
          <div className="config-actions">
            <button className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 