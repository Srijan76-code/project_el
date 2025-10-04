'use client';

import OrganizationApproval from '@/components/OrganizationApproval';

export default function TestInputsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          🧪 Input Visibility Test
        </h1>
        
        {/* Test standard inputs */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Standard HTML Inputs</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Text Input Test
              </label>
              <input
                type="text"
                placeholder="Can you see this input?"
                className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900"
                style={{ minHeight: '50px', fontSize: '16px' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Number Input Test
              </label>
              <input
                type="number"
                placeholder="Enter a number"
                className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900"
                style={{ minHeight: '50px', fontSize: '16px' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Select Test
              </label>
              <select
                className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900"
                style={{ minHeight: '50px', fontSize: '16px' }}
              >
                <option value="">Choose an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Organization Approval Component */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Organization Approval Component</h2>
          <OrganizationApproval />
        </div>
      </div>
    </div>
  );
}