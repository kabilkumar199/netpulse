import React from 'react';
import { Search, Map, Route, BarChart3 } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: 'discover',
      title: 'Discover Network',
      description: 'Start a new network discovery scan',
      icon: Search,
      color: 'blue',
      href: '/discover/scan'
    },
    {
      id: 'topology',
      title: 'View Topology',
      description: 'Open network topology map',
      icon: Map,
      color: 'green',
      href: '/network/topology'
    },
    {
      id: 'path-analysis',
      title: 'Path Analysis',
      description: 'Analyze network paths and reachability',
      icon: Route,
      color: 'purple',
      href: '/analyze/paths'
    },
    {
      id: 'reports',
      title: 'Generate Report',
      description: 'Create network inventory report',
      icon: BarChart3,
      color: 'orange',
      href: '/analyze/reports'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700:bg-blue-800',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700:bg-green-800',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700:bg-purple-800',
    orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700:bg-orange-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            className={`block p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${colorClasses[action.color]}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">
                  {action.title}
                </h4>
                <p className="text-xs opacity-75 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

