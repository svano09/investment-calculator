import { Clock, Trash2 } from 'lucide-react';

const HistoryPanel = ({ calculations, onDelete, onLoad, loading, isLoggedIn }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'dca': return 'bg-indigo-100 text-indigo-700';
      case 'compound': return 'bg-green-100 text-green-700';
      case 'retirement': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'dca': return 'DCA';
      case 'compound': return 'Compound';
      case 'retirement': return 'Retirement';
      default: return type;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 text-sm">Login to view calculation history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-500 text-sm mt-3">Loading history...</p>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 text-sm">No calculations yet</p>
        <p className="text-gray-400 text-xs mt-1">Make a calculation to see it here</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Calculation History
      </h2>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {calculations.map((calc) => (
          <div
            key={calc._id}
            className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition cursor-pointer border border-gray-200"
            onClick={() => onLoad(calc)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getTypeColor(calc.type)}`}>
                {getTypeName(calc.type)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(calc._id);
                }}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p className="text-xs text-gray-500 mb-1">{formatDate(calc.createdAt)}</p>
              {calc.type === 'dca' && (
                <>
                  <p>Monthly: {formatCurrency(calc.inputs.monthly)}</p>
                  <p className="text-indigo-600 font-semibold">
                    Final: {formatCurrency(calc.results.finalValue)}
                  </p>
                </>
              )}
              {calc.type === 'compound' && (
                <>
                  <p>Principal: {formatCurrency(calc.inputs.principal)}</p>
                  <p className="text-green-600 font-semibold">
                    Final: {formatCurrency(calc.results.finalValue)}
                  </p>
                </>
              )}
              {calc.type === 'retirement' && (
                <>
                  <p>Target: {formatCurrency(calc.inputs.targetAmount)}</p>
                  <p className="text-purple-600 font-semibold">
                    Monthly: {formatCurrency(calc.results.monthlyRequired)}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;