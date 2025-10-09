import React, { useState, useEffect } from 'react';
import {
  Bell,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';

interface Alarm {
  id: number;
  title: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'New' | 'Acknowledged' | 'Assigned' | 'Resolved' | 'Cleared';
  type: 'Chassis' | 'Interface' | 'System';
  source: string;
  description: string;
  timestamp: string;
  assignedTo: string | null;
  escalatedTo: string | null;
  comments: Comment[];
  timeline: TimelineEvent[];
}

interface Comment {
  id: number;
  comment: string;
  user: string;
  timestamp: string;
}

interface TimelineEvent {
  status: string;
  comment: string;
  user: string;
  timestamp: string;
}

interface AlarmFilters {
  severity: string;
  status: string;
  type: string;
  search: string;
}

interface DeviceType {
  id: string;
  icon: string;
  name: string;
  description: string;
}

const deviceTypes: DeviceType[] = [
  { id: 'cisco', icon: '🌐', name: 'Cisco', description: 'Core Routing Switch' },
  { id: 'dell', icon: '🖥️', name: 'Dell', description: 'Server Infrastructure' },
  { id: 'fortinet', icon: '🛡️', name: 'Fortinet', description: 'Security Gateway' },
];

interface AlertManagementProps {
  onClose: () => void;
}

const AlertManagement: React.FC<AlertManagementProps> = ({ onClose }) => {
  const [selectedDeviceType, setSelectedDeviceType] = useState('cisco');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [filteredAlarms, setFilteredAlarms] = useState<Alarm[]>([]);
  const [selectedAlarms, setSelectedAlarms] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alarmsPerPage, setAlarmsPerPage] = useState(25);
  const [filters, setFilters] = useState<AlarmFilters>({
    severity: 'all',
    status: 'all',
    type: 'all',
    search: ''
  });
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const userList = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Alice Brown', 'Bob Wilson'];

  const generateMockAlarms = (deviceType: string): Alarm[] => {
    const severities: Array<'Critical' | 'Major' | 'Minor'> = ['Critical', 'Major', 'Minor'];
    const statuses: Array<'New' | 'Acknowledged' | 'Assigned' | 'Resolved' | 'Cleared'> = ['New', 'Acknowledged', 'Assigned', 'Resolved', 'Cleared'];
    const types: Array<'Chassis' | 'Interface' | 'System'> = ['Chassis', 'Interface', 'System'];
    const alarms: Alarm[] = [];

    for (let i = 1; i <= 100; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      alarms.push({
        id: i,
        title: `Alarm ${i} - ${type}`,
        severity,
        status,
        type,
        source: `${deviceType}-${String(i).padStart(6, '0')}`,
        description: `${type} ${severity.toLowerCase()} issue detected`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        assignedTo: status === 'Assigned' ? userList[Math.floor(Math.random() * userList.length)] : null,
        escalatedTo: null,
        comments: [],
        timeline: [
          {
            status: 'New',
            comment: 'Alarm created',
            user: 'System',
            timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
          }
        ]
      });
    }

    return alarms;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAlarms(generateMockAlarms(selectedDeviceType));
      setLoading(false);
    }, 500);
  }, [selectedDeviceType]);

  useEffect(() => {
    const filtered = alarms.filter(alarm =>
      (filters.severity === 'all' || alarm.severity === filters.severity) &&
      (filters.status === 'all' || alarm.status === filters.status) &&
      (filters.type === 'all' || alarm.type === filters.type) &&
      (!filters.search || alarm.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        alarm.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
    setFilteredAlarms(filtered);
    setCurrentPage(1);
  }, [alarms, filters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAlarms(generateMockAlarms(selectedDeviceType));
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlarms(new Set(currentAlarms.map(a => a.id)));
    } else {
      setSelectedAlarms(new Set());
    }
  };

  const handleAlarmSelect = (alarmId: number, checked: boolean) => {
    const newSelected = new Set(selectedAlarms);
    if (checked) {
      newSelected.add(alarmId);
    } else {
      newSelected.delete(alarmId);
    }
    setSelectedAlarms(newSelected);
  };

  const handleBulkAction = (action: string) => {
    setCurrentAction(action);
    setActionComment('');
    setSelectedUser('');
    setShowActionModal(true);
  };

  const confirmBulkAction = () => {
    if (currentAction === 'assign' && !selectedUser) {
      alert('Please select a user');
      return;
    }
    if (!actionComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    const updated = alarms.map(alarm => {
      if (selectedAlarms.has(alarm.id)) {
        let newStatus = alarm.status;
        const updatedAlarm = { ...alarm };

        if (currentAction === 'acknowledge' && alarm.status === 'New') {
          newStatus = 'Acknowledged';
        } else if (currentAction === 'assign') {
          newStatus = 'Assigned';
          updatedAlarm.assignedTo = selectedUser;
        } else if (currentAction === 'resolve') {
          newStatus = 'Resolved';
        } else if (currentAction === 'clear') {
          newStatus = 'Cleared';
        }

        updatedAlarm.status = newStatus;
        updatedAlarm.comments = [
          ...alarm.comments,
          {
            id: Date.now(),
            comment: actionComment,
            user: selectedUser || 'Current User',
            timestamp: new Date().toISOString()
          }
        ];
        updatedAlarm.timeline = [
          ...alarm.timeline,
          {
            status: newStatus,
            comment: actionComment,
            user: selectedUser || 'Current User',
            timestamp: new Date().toISOString()
          }
        ];

        return updatedAlarm;
      }
      return alarm;
    });

    setAlarms(updated);
    setSelectedAlarms(new Set());
    setShowActionModal(false);
    setActionComment('');
    setSelectedUser('');
    setCurrentAction(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'Major': return 'bg-orange-500 text-white';
      case 'Minor': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-red-500 text-white';
      case 'Acknowledged': return 'bg-yellow-500 text-black';
      case 'Assigned': return 'bg-blue-500 text-white';
      case 'Resolved': return 'bg-green-500 text-white';
      case 'Cleared': return 'bg-gray-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Chassis': return 'bg-red-100 text-red-800';
      case 'Interface': return 'bg-blue-100 text-blue-800';
      case 'System': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: alarms.length,
    critical: alarms.filter(a => a.severity === 'Critical').length,
    chassis: alarms.filter(a => a.type === 'Chassis').length,
    interface: alarms.filter(a => a.type === 'Interface').length,
    system: alarms.filter(a => a.type === 'System').length,
    cleared: alarms.filter(a => a.status === 'Cleared').length
  };

  const totalPages = Math.ceil(filteredAlarms.length / alarmsPerPage);
  const currentAlarms = filteredAlarms.slice(
    (currentPage - 1) * alarmsPerPage,
    currentPage * alarmsPerPage
  );

  const resetFilters = () => {
    setFilters({
      severity: 'all',
      status: 'all',
      type: 'all',
      search: ''
    });
  };

  const canResetFilters = filters.severity !== 'all' || filters.status !== 'all' || filters.type !== 'all' || filters.search !== '';

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Alert Management</h1>
              <p className="text-sm text-gray-500">Monitor and manage network alarms</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-4">
        {/* Device Type Selector */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Device Type</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isRefreshing
                  ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {deviceTypes.map(device => (
              <button
                key={device.id}
                onClick={() => setSelectedDeviceType(device.id)}
                className={`flex min-w-64 items-center space-x-3 rounded-lg px-6 py-4 font-medium shadow transition-all ${
                  selectedDeviceType === device.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{device.icon}</span>
                <div className="text-left">
                  <div className="font-bold">{device.name}</div>
                  <div className={`text-xs ${selectedDeviceType === device.id ? 'text-white opacity-90' : 'text-gray-500'}`}>
                    {device.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alarm Statistics */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Alarm Statistics</h2>
          <div className="flex flex-wrap gap-4">
            <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow border border-gray-200">
              <h3 className="text-xl font-bold text-blue-600">{stats.total}</h3>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow border border-gray-200">
              <h3 className="text-xl font-bold text-red-600">{stats.critical}</h3>
              <p className="text-sm text-gray-600">Critical</p>
            </div>
            <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow border border-gray-200">
              <h3 className="text-xl font-bold text-orange-600">{stats.chassis}</h3>
              <p className="text-sm text-gray-600">Chassis</p>
            </div>
            <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow border border-gray-200">
              <h3 className="text-xl font-bold text-blue-600">{stats.interface}</h3>
              <p className="text-sm text-gray-600">Interface</p>
            </div>
            <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow border border-gray-200">
              <h3 className="text-xl font-bold text-purple-600">{stats.system}</h3>
              <p className="text-sm text-gray-600">System</p>
            </div>
            <div className="min-w-32 rounded-lg bg-white p-4 text-center shadow border border-gray-200">
              <h3 className="text-xl font-bold text-gray-600">{stats.cleared}</h3>
              <p className="text-sm text-gray-600">Cleared</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-lg bg-white p-4 shadow border border-gray-200 mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            {canResetFilters && (
              <button
                onClick={resetFilters}
                className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.severity}
              onChange={e => setFilters({ ...filters, severity: e.target.value })}
              className="rounded-md border p-2 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
            </select>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="rounded-md border p-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Cleared">Cleared</option>
            </select>
            <select
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
              className="rounded-md border p-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="Chassis">Chassis</option>
              <option value="Interface">Interface</option>
              <option value="System">System</option>
            </select>
            <input
              type="text"
              placeholder="Search alarms..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="rounded-md border p-2 text-sm flex-1 min-w-[200px]"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAlarms.size > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-700">
                {selectedAlarms.size} alarm{selectedAlarms.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('acknowledge')}
                  className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleBulkAction('assign')}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  Assign
                </button>
                <button
                  onClick={() => handleBulkAction('resolve')}
                  className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleBulkAction('clear')}
                  className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alarms Table */}
        <div className="rounded-lg bg-white shadow border border-gray-200">
          <div className="border-b p-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alarms ({filteredAlarms.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={e => handleSelectAll(e.target.checked)}
                      checked={selectedAlarms.size === currentAlarms.length && currentAlarms.length > 0}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">Loading...</td>
                  </tr>
                ) : currentAlarms.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No alarms found</td>
                  </tr>
                ) : (
                  currentAlarms.map(alarm => (
                    <tr key={alarm.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAlarms.has(alarm.id)}
                          onChange={e => handleAlarmSelect(alarm.id, e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getTypeColor(alarm.type)}`}>
                          {alarm.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getSeverityColor(alarm.severity)}`}>
                          {alarm.severity}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">{alarm.title}</td>
                      <td className="px-4 py-4 text-sm">{alarm.description}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(alarm.status)}`}>
                          {alarm.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">{alarm.source}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            setSelectedAlarm(alarm);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex items-center space-x-4">
              <select
                value={alarmsPerPage}
                onChange={e => {
                  setAlarmsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded border p-1 text-sm"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <p className="text-sm text-gray-700">
                Showing {(currentPage - 1) * alarmsPerPage + 1} to{' '}
                {Math.min(currentPage * alarmsPerPage, filteredAlarms.length)} of{' '}
                {filteredAlarms.length.toLocaleString()}
              </p>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alarm Details Modal */}
      {showDetailsModal && selectedAlarm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-3/4 max-h-[80vh] overflow-y-auto p-6 m-4">
            <div className="mb-4 flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold">Alarm Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="mb-3 font-semibold text-lg">Basic Information</h4>
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-700">Title:</strong>
                    <p className="text-gray-900">{selectedAlarm.title}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Description:</strong>
                    <p className="text-gray-900">{selectedAlarm.description}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Type:</strong>
                    <span className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs ${getTypeColor(selectedAlarm.type)}`}>
                      {selectedAlarm.type}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Severity:</strong>
                    <span className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs ${getSeverityColor(selectedAlarm.severity)}`}>
                      {selectedAlarm.severity}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Status:</strong>
                    <span className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(selectedAlarm.status)}`}>
                      {selectedAlarm.status}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Source:</strong>
                    <p className="text-gray-900">{selectedAlarm.source}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-lg">Assignment</h4>
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-700">Assigned To:</strong>
                    <p className="text-gray-900">{selectedAlarm.assignedTo || 'None'}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Created:</strong>
                    <p className="text-gray-900">{new Date(selectedAlarm.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedAlarm.comments.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 font-semibold text-lg">
                  Comments ({selectedAlarm.comments.length})
                </h4>
                <div className="max-h-60 space-y-3 overflow-y-auto">
                  {selectedAlarm.comments.map(comment => (
                    <div key={comment.id} className="rounded bg-blue-50 p-3 border border-blue-200">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm font-medium">{comment.user}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-lg">Timeline</h4>
              <div className="max-h-60 space-y-3 overflow-y-auto">
                {selectedAlarm.timeline.map((event, i) => (
                  <div key={i} className="rounded bg-gray-50 p-3 border border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{event.status}</div>
                        <div className="text-sm text-gray-600">{event.comment}</div>
                        <div className="text-xs text-gray-500">by {event.user}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between border-t pt-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedAlarms(new Set([selectedAlarm.id]));
                    handleBulkAction('acknowledge');
                    setShowDetailsModal(false);
                  }}
                  disabled={selectedAlarm.status !== 'New'}
                  className={`rounded px-4 py-2 text-sm ${
                    selectedAlarm.status === 'New'
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'cursor-not-allowed bg-gray-300 text-gray-500'
                  }`}
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => {
                    setSelectedAlarms(new Set([selectedAlarm.id]));
                    handleBulkAction('assign');
                    setShowDetailsModal(false);
                  }}
                  className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                  Assign
                </button>
                <button
                  onClick={() => {
                    setSelectedAlarms(new Set([selectedAlarm.id]));
                    handleBulkAction('resolve');
                    setShowDetailsModal(false);
                  }}
                  className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
                >
                  Resolve
                </button>
                <button
                  onClick={() => {
                    setSelectedAlarms(new Set([selectedAlarm.id]));
                    handleBulkAction('clear');
                    setShowDetailsModal(false);
                  }}
                  className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && currentAction && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-96 p-6 m-4">
            <h3 className="mb-4 text-lg font-bold capitalize">{currentAction} Alarm(s)</h3>
            <p className="mb-3 text-sm text-gray-600">
              About to {currentAction} {selectedAlarms.size} alarm(s)
            </p>
            
            {currentAction === 'assign' && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Assign To *</label>
                <select
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full rounded-md border p-2"
                >
                  <option value="">Select user...</option>
                  {userList.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Comment *</label>
              <textarea
                value={actionComment}
                onChange={e => setActionComment(e.target.value)}
                rows={4}
                className="w-full rounded-md border p-2"
                placeholder="Enter a comment..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={confirmBulkAction}
                className="flex-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionComment('');
                  setSelectedUser('');
                  setCurrentAction(null);
                }}
                className="flex-1 rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AlertManagement;

