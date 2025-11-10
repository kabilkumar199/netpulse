import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Device } from "../../../types";
import {
  Server,
  MapPin,
  Calendar,
  Network,
  Tag,
  Activity,
  Cpu,
  HardDrive,
  Clock,
  Monitor,
  BarChart3,
  TrendingUp,
  Circle,
} from "lucide-react";

interface OverviewTabProps {
  device: Device;
}

interface MemoryInfo {
  totalGB: number;
  usedGB: number;
  freeGB: number;
  buffersGB: number;
  cachedGB: number;
  sharedGB: number;
}

interface BufferInfo {
  totalGB: number;
  usedGB: number;
  freeGB: number;
}

interface ProcessInfo {
  command: string;
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  stat: string;
  vsz: number;
  rss: number;
  start: string;
  time: string;
  tty: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ device }) => {
  const navigate = useNavigate();

  // Mock Memory and Buffer data - Replace with actual API data
  const memoryInfo: MemoryInfo = {
    totalGB: 9.5294,
    usedGB: 2.23, // 23.4% of 9.5294
    freeGB: 5.89, // 61.8% of 9.5294
    buffersGB: 0.0,
    cachedGB: 1.4093, // 14.8% of 9.5294
    sharedGB: 0.0,
  };

  const bufferInfo: BufferInfo = {
    totalGB: 9.5294,
    usedGB: 0.9625, // 10.1% of 9.5294
    freeGB: 8.5669, // 89.9% of 9.5294
  };

  // Calculate percentages
  const memoryUsedPercent = (memoryInfo.usedGB / memoryInfo.totalGB) * 100;
  const memoryFreePercent = (memoryInfo.freeGB / memoryInfo.totalGB) * 100;
  const memoryCachedPercent = (memoryInfo.cachedGB / memoryInfo.totalGB) * 100;

  const bufferUsedPercent = (bufferInfo.usedGB / bufferInfo.totalGB) * 100;
  const bufferFreePercent = (bufferInfo.freeGB / bufferInfo.totalGB) * 100;

  // Mock Process data - Replace with actual API data
  const mockProcesses: ProcessInfo[] = [
    {
      command: "kworker/0:0",
      pid: 2,
      user: "root",
      cpu: 0,
      mem: 0.1,
      stat: "S",
      vsz: 0,
      rss: 0,
      start: "01:00:00",
      time: "00:00:00",
      tty: "?",
    },
    {
      command: "kthreadd",
      pid: 3,
      user: "root",
      cpu: 0,
      mem: 0.0,
      stat: "S",
      vsz: 0,
      rss: 0,
      start: "01:00:00",
      time: "00:00:00",
      tty: "?",
    },
    {
      command: "ksoftirqd/0",
      pid: 4,
      user: "root",
      cpu: 0,
      mem: 0.0,
      stat: "S",
      vsz: 0,
      rss: 0,
      start: "01:00:00",
      time: "00:00:00",
      tty: "?",
    },
    {
      command: "systemd",
      pid: 1,
      user: "root",
      cpu: 0.1,
      mem: 1.2,
      stat: "Ss",
      vsz: 245760,
      rss: 12288,
      start: "01:00:00",
      time: "00:02:15",
      tty: "?",
    },
    {
      command: "sshd",
      pid: 542,
      user: "root",
      cpu: 0.0,
      mem: 0.8,
      stat: "Ss",
      vsz: 196608,
      rss: 8192,
      start: "01:05:00",
      time: "00:00:10",
      tty: "?",
    },
    {
      command: "nginx",
      pid: 1205,
      user: "www-data",
      cpu: 0.2,
      mem: 2.5,
      stat: "S",
      vsz: 131072,
      rss: 25600,
      start: "01:10:00",
      time: "00:05:30",
      tty: "?",
    },
    {
      command: "mysql",
      pid: 1456,
      user: "mysql",
      cpu: 0.5,
      mem: 5.8,
      stat: "Ssl",
      vsz: 3145728,
      rss: 59392,
      start: "01:12:00",
      time: "00:15:20",
      tty: "?",
    },
    {
      command: "node",
      pid: 2134,
      user: "app",
      cpu: 0.3,
      mem: 3.2,
      stat: "Sl",
      vsz: 524288,
      rss: 32768,
      start: "01:15:00",
      time: "00:08:45",
      tty: "?",
    },
    {
      command: "bash",
      pid: 2543,
      user: "root",
      cpu: 0.0,
      mem: 0.4,
      stat: "Ss",
      vsz: 65536,
      rss: 4096,
      start: "01:20:00",
      time: "00:00:05",
      tty: "pts/0",
    },
    {
      command: "top",
      pid: 2678,
      user: "root",
      cpu: 1.2,
      mem: 1.5,
      stat: "S+",
      vsz: 98304,
      rss: 15360,
      start: "01:25:00",
      time: "00:01:30",
      tty: "pts/0",
    },
  ];

  const handleViewCharts = () => {
    // Navigate to Performance Dashboard with device ID
    navigate(`/monitoring/performance/${device.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
        return "bg-green-900 text-green-300 border-green-700";
      case "down":
        return "bg-red-900 text-red-300 border-red-700";
      case "warning":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      case "unknown":
        return "bg-gray-700 text-gray-300 border-gray-600";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return "🟢";
      case "down":
        return "🔴";
      case "warning":
        return "🟡";
      case "unknown":
        return "⚪";
      default:
        return "⚪";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getStatusIcon(device.status)}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                    device.status
                  )}`}
                >
                  {device.status.toUpperCase()}
                </span>
              </div>
            </div>
            <Activity className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Interfaces</p>
              <p className="text-2xl font-semibold text-white">
                {(device.interfaces || []).length}
              </p>
            </div>
            <Network className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Monitors</p>
              <p className="text-2xl font-semibold text-white">
                {(device.monitors || []).length}
              </p>
            </div>
            <Monitor className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Labels</p>
              <p className="text-2xl font-semibold text-white">
                {(device.labels || []).length}
              </p>
            </div>
            <Tag className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Information */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Server className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white text-lg">
              Device Information
            </h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Server className="w-4 h-4" />
                Hostname
              </span>
              <span className="text-white font-medium">{device.hostname}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Network className="w-4 h-4" />
                FQDN
              </span>
              <span className="text-white">{device.fqdn || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Vendor
              </span>
              <span className="text-white">{device.vendor}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Model
              </span>
              <span className="text-white">{device.model}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                OS
              </span>
              <span className="text-white">{device.os}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </span>
              <span className="text-white">
                {device.location?.name || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Seen
              </span>
              <span className="text-white text-sm">
                {formatDate(device.lastSeen)}
              </span>
            </div>
          </div>
        </div>

        {/* Network Information */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Network className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white text-lg">
              Network Information
            </h4>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 text-sm mb-2 block">
                IP Addresses
              </span>
              <div className="flex flex-wrap gap-2">
                {(device.ipAddresses || []).length > 0 ? (
                  (device.ipAddresses || []).map(
                    (ip: string, index: number) => (
                      <span
                        key={index}
                        className="text-white font-mono text-xs bg-gray-700 px-3 py-1.5 rounded border border-gray-600 hover:border-blue-500 transition-colors"
                      >
                        {ip}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-gray-500 text-sm">No IP addresses</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory and Process Information Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white text-lg flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Memory and Process Information
          </h4>
        </div>

        {/* Memory & Buffer Usage Overview - Clickable Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Memory Pie Chart - Clickable */}
          <div
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 cursor-pointer hover:border-blue-500 transition-colors group"
            onClick={handleViewCharts}
            title="Click to view detailed charts in Performance Dashboard"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-semibold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-400" />
                Memory Chart
              </h5>
              <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <svg
                  className="w-48 h-48 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Used Memory */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${memoryUsedPercent * 2.513} 251.3`}
                    strokeDashoffset="0"
                    className="text-red-500"
                  />
                  {/* Free Memory */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${memoryFreePercent * 2.513} 251.3`}
                    strokeDashoffset={`-${memoryUsedPercent * 2.513}`}
                    className="text-green-500"
                  />
                  {/* Cached Memory */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${memoryCachedPercent * 2.513} 251.3`}
                    strokeDashoffset={`-${
                      (memoryUsedPercent + memoryFreePercent) * 2.513
                    }`}
                    className="text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {memoryInfo.totalGB.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-400">GB Total</div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                    <span className="text-gray-300">Used</span>
                  </div>
                  <span className="text-white font-medium">
                    {memoryUsedPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-gray-300">Free</span>
                  </div>
                  <span className="text-white font-medium">
                    {memoryFreePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
                    <span className="text-gray-300">Cached</span>
                  </div>
                  <span className="text-white font-medium">
                    {memoryCachedPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center text-xs text-gray-400">
                Total Memory: {memoryInfo.totalGB.toFixed(4)} GB
              </div>
            </div>
          </div>

          {/* Buffer Pie Chart - Clickable */}
          <div
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 cursor-pointer hover:border-blue-500 transition-colors group"
            onClick={handleViewCharts}
            title="Click to view detailed charts in Performance Dashboard"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Buffer Chart
              </h5>
              <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <svg
                  className="w-48 h-48 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Used Buffer */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${bufferUsedPercent * 2.513} 251.3`}
                    strokeDashoffset="0"
                    className="text-red-500"
                  />
                  {/* Free Buffer */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${bufferFreePercent * 2.513} 251.3`}
                    strokeDashoffset={`-${bufferUsedPercent * 2.513}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {bufferInfo.totalGB.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-400">GB Total</div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                    <span className="text-gray-300">Used</span>
                  </div>
                  <span className="text-white font-medium">
                    {bufferUsedPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                    <span className="text-gray-300">Free</span>
                  </div>
                  <span className="text-white font-medium">
                    {bufferFreePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center text-xs text-gray-400">
                Total Buffer: {bufferInfo.totalGB.toFixed(4)} GB
              </div>
            </div>
          </div>
        </div>

        {/* Memory & Buffer Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Memory Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-700">
              <h5 className="font-semibold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                Memory
              </h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Value (GB)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Total GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-white font-mono text-sm">
                      {memoryInfo.totalGB.toFixed(4)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Used GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-red-300 font-mono text-sm font-semibold">
                      {memoryInfo.usedGB.toFixed(4)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Free GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-green-300 font-mono text-sm font-semibold">
                      {memoryInfo.freeGB.toFixed(4)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Buffers GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-white font-mono text-sm">
                      {memoryInfo.buffersGB.toFixed(4)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Cached GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-blue-300 font-mono text-sm">
                      {memoryInfo.cachedGB.toFixed(4)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Shared GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-white font-mono text-sm">
                      {memoryInfo.sharedGB.toFixed(4)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Buffer Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-700">
              <h5 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Buffer
              </h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Value (GB)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Total GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-white font-mono text-sm">
                      {bufferInfo.totalGB.toFixed(4)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Used GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-red-300 font-mono text-sm font-semibold">
                      {bufferInfo.usedGB.toFixed(4)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      Free GB
                    </td>
                    <td className="px-4 py-2.5 text-right text-green-300 font-mono text-sm font-semibold">
                      {bufferInfo.freeGB.toFixed(4)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Process Information Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
            <h5 className="font-semibold text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-400" />
              Process Information
            </h5>
            <button
              onClick={handleViewCharts}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
              title="View CPU usage charts in Performance Dashboard"
            >
              <BarChart3 className="w-3 h-3" />
              View CPU Charts
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    COMMAND
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    PID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    USER
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    %CPU
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    %MEM
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    STAT
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    VSZ
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    RSS
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    START
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    TIME
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    TTY
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockProcesses.map((process) => (
                  <tr
                    key={process.pid}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-white text-sm font-mono">
                      {process.command}
                    </td>
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      {process.pid}
                    </td>
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      {process.user}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-300 text-sm">
                      {process.cpu.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-300 text-sm">
                      {process.mem.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5 text-gray-300 text-sm font-mono">
                      {process.stat}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-300 text-sm">
                      {process.vsz.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-300 text-sm">
                      {process.rss.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      {process.start}
                    </td>
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      {process.time}
                    </td>
                    <td className="px-4 py-2.5 text-gray-300 text-sm">
                      {process.tty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
