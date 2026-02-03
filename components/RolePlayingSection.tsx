'use client';

import { useState } from 'react';
import type { RoleOutput } from '@/lib/lesson-generator';

interface Props {
  roleOutputs: RoleOutput[];
  problem: string;
}

export default function RolePlayingSection({ roleOutputs, problem }: Props) {
  const [selectedRole, setSelectedRole] = useState(0);

  const roleIcons: { [key: string]: string } = {
    'Infrastructure Architect': '🏗️',
    'Data Lead': '📊',
    'Training Engineer': '⚙️',
    'SRE (Site Reliability Engineer)': '🛡️',
    'Cost Officer': '💰',
    'Red Team': '🔴',
  };

  const roleColors: { [key: string]: string } = {
    'Infrastructure Architect': 'from-blue-500 to-blue-600',
    'Data Lead': 'from-green-500 to-green-600',
    'Training Engineer': 'from-purple-500 to-purple-600',
    'SRE (Site Reliability Engineer)': 'from-orange-500 to-orange-600',
    'Cost Officer': 'from-yellow-500 to-yellow-600',
    'Red Team': 'from-red-500 to-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        👥 Multi-Role Analysis
      </h2>
      <p className="text-gray-600 mb-6">
        Explore different perspectives on solving this problem. Each role brings unique insights,
        concerns, and recommendations.
      </p>

      {/* Role Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {roleOutputs.map((output, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedRole(idx)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRole === idx
                ? 'bg-gradient-to-r ' + (roleColors[output.role] || 'from-gray-500 to-gray-600') + ' text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{roleIcons[output.role] || '👤'}</span>
            {output.role}
          </button>
        ))}
      </div>

      {/* Role Content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className={`text-4xl mr-4`}>
            {roleIcons[roleOutputs[selectedRole].role] || '👤'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {roleOutputs[selectedRole].role}
            </h3>
            <p className="text-gray-600">Perspective & Analysis</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* View */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-indigo-600 mr-2">👁️</span>
              View
            </h4>
            <p className="text-gray-700 bg-white rounded p-3">
              {roleOutputs[selectedRole].view}
            </p>
          </div>

          {/* Evidence */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-green-600 mr-2">📋</span>
              Supporting Evidence
            </h4>
            <ul className="space-y-2">
              {roleOutputs[selectedRole].evidence.map((item, idx) => (
                <li key={idx} className="flex items-start bg-white rounded p-3">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              Identified Risks
            </h4>
            <ul className="space-y-2">
              {roleOutputs[selectedRole].risks.map((risk, idx) => (
                <li key={idx} className="flex items-start bg-white rounded p-3">
                  <span className="text-red-600 mr-2">•</span>
                  <span className="text-gray-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade-offs */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-orange-600 mr-2">⚖️</span>
              Trade-offs
            </h4>
            <ul className="space-y-2">
              {roleOutputs[selectedRole].tradeOffs.map((tradeOff, idx) => (
                <li key={idx} className="flex items-start bg-white rounded p-3">
                  <span className="text-orange-600 mr-2">•</span>
                  <span className="text-gray-700">{tradeOff}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">✅</span>
              Recommended Actions
            </h4>
            <ul className="space-y-2">
              {roleOutputs[selectedRole].actions.map((action, idx) => (
                <li key={idx} className="flex items-start bg-white rounded p-3">
                  <span className="text-blue-600 mr-2 font-bold">{idx + 1}.</span>
                  <span className="text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-indigo-50 border-l-4 border-indigo-600 p-4">
        <h4 className="font-semibold text-indigo-900 mb-2">💡 Integration Note</h4>
        <p className="text-indigo-800 text-sm">
          Each role provides a different lens on the problem. A comprehensive solution should
          balance insights from all perspectives, addressing technical requirements, operational
          concerns, cost constraints, and potential risks.
        </p>
      </div>
    </div>
  );
}
