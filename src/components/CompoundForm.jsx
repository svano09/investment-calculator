import { useState } from 'react';

const CompoundForm = ({ onCalculate }) => {
  const [principal, setPrincipal] = useState('100000');
  const [years, setYears] = useState('10');
  const [returnRate, setReturnRate] = useState('8');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCalculate('compound', { principal, years, returnRate });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Principal Amount (฿)
        </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          required
          min="0"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Investment Period (Years)
        </label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          required
          min="1"
          max="50"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Annual Return (%)
        </label>
        <input
          type="number"
          step="0.1"
          value={returnRate}
          onChange={(e) => setReturnRate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          required
          min="0"
          max="50"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-green-400"
      >
        {loading ? 'Calculating...' : 'Calculate Compound Interest'}
      </button>
    </form>
  );
};

export default CompoundForm;