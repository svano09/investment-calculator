import { Calculator } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResultsDisplay = ({ type, results, chartData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (!results || !chartData) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Enter values and calculate to see results</p>
      </div>
    );
  }

  if (type === 'dca') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Final Value</p>
            <p className="text-2xl font-bold text-indigo-600">{formatCurrency(results.finalValue)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Return</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(results.totalReturn)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.totalInvested)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Return %</p>
            <p className="text-2xl font-bold text-purple-600">{results.returnPercentage.toFixed(2)}%</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Area type="monotone" dataKey="invested" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Invested" />
            <Area type="monotone" dataKey="value" stackId="2" stroke="#6366f1" fill="#a5b4fc" name="Total Value" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'compound') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Final Value</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(results.finalValue)}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Return</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(results.totalReturn)}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Principal</p>
            <p className="text-2xl font-bold text-teal-600">{formatCurrency(results.principal)}</p>
          </div>
          <div className="bg-cyan-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Return %</p>
            <p className="text-2xl font-bold text-cyan-600">{results.returnPercentage.toFixed(2)}%</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="principal" stroke="#94a3b8" strokeDasharray="5 5" name="Principal" />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'retirement') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Required</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.monthlyRequired)}</p>
          </div>
          <div className="bg-violet-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Years to Retirement</p>
            <p className="text-2xl font-bold text-violet-600">{results.yearsToRetirement}</p>
          </div>
          <div className="bg-fuchsia-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total to Invest</p>
            <p className="text-2xl font-bold text-fuchsia-600">{formatCurrency(results.totalToInvest)}</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Target Amount</p>
            <p className="text-2xl font-bold text-pink-600">{formatCurrency(results.projectedValue)}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target" />
            <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} name="Projected Value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default ResultsDisplay;