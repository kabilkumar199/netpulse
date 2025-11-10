import React, { useState } from "react";
import type { Device } from "../../../types";
import { Cpu, Zap, Thermometer, Wind } from "lucide-react";

interface PeripheralsTabProps {
  device: Device;
}

interface Transceiver {
  id: string;
  slot: string;
  type: string;
  vendor: string;
  partNumber: string;
  serialNumber: string;
  wavelength?: string;
  distance?: string;
  status: "up" | "down" | "warning";
}

interface PSU {
  id: string;
  slot: string;
  model: string;
  vendor: string;
  power: string;
  voltage: string;
  status: "up" | "down" | "warning";
  temperature?: string;
}

interface Thermal {
  id: string;
  sensor: string;
  location: string;
  temperature: number;
  threshold: number;
  status: "normal" | "warning" | "critical";
  unit: "celsius" | "fahrenheit";
}

interface Fan {
  id: string;
  slot: string;
  name: string;
  speed: number;
  maxSpeed: number;
  status: "up" | "down" | "warning";
  direction?: "forward" | "reverse";
}

const PeripheralsTab: React.FC<PeripheralsTabProps> = ({ device }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "transceiver" | "psu" | "thermal" | "fan"
  >("transceiver");

  // Mock data - Replace with actual API data
  const mockTransceivers: Transceiver[] = [
    {
      id: "xcv-1",
      slot: "GigabitEthernet0/1",
      type: "SFP",
      vendor: "Cisco",
      partNumber: "GLC-T",
      serialNumber: "FNS12345678",
      wavelength: "1310nm",
      distance: "10km",
      status: "up",
    },
    {
      id: "xcv-2",
      slot: "GigabitEthernet0/2",
      type: "SFP+",
      vendor: "Finisar",
      partNumber: "FCLF8521P2BTL",
      serialNumber: "FNS87654321",
      wavelength: "850nm",
      distance: "300m",
      status: "up",
    },
    {
      id: "xcv-3",
      slot: "TenGigabitEthernet1/1",
      type: "SFP+",
      vendor: "Cisco",
      partNumber: "SFP-10G-SR",
      serialNumber: "CIS12345678",
      wavelength: "850nm",
      distance: "400m",
      status: "warning",
    },
  ];

  const mockPSUs: PSU[] = [
    {
      id: "psu-1",
      slot: "PSU1",
      model: "PWR-C5-715WAC",
      vendor: "Cisco",
      power: "715W",
      voltage: "100-240V AC",
      status: "up",
      temperature: "45°C",
    },
    {
      id: "psu-2",
      slot: "PSU2",
      model: "PWR-C5-715WAC",
      vendor: "Cisco",
      power: "715W",
      voltage: "100-240V AC",
      status: "up",
      temperature: "47°C",
    },
  ];

  const mockThermal: Thermal[] = [
    {
      id: "temp-1",
      sensor: "CPU",
      location: "Chassis",
      temperature: 45,
      threshold: 70,
      status: "normal",
      unit: "celsius",
    },
    {
      id: "temp-2",
      sensor: "ASIC",
      location: "Chassis",
      temperature: 55,
      threshold: 85,
      status: "normal",
      unit: "celsius",
    },
    {
      id: "temp-3",
      sensor: "Inlet",
      location: "Front",
      temperature: 28,
      threshold: 40,
      status: "normal",
      unit: "celsius",
    },
    {
      id: "temp-4",
      sensor: "Outlet",
      location: "Rear",
      temperature: 38,
      threshold: 50,
      status: "normal",
      unit: "celsius",
    },
  ];

  const mockFans: Fan[] = [
    {
      id: "fan-1",
      slot: "Fan Tray 1",
      name: "Fan 1",
      speed: 3500,
      maxSpeed: 12000,
      status: "up",
      direction: "forward",
    },
    {
    id: "fan-2",
      slot: "Fan Tray 1",
      name: "Fan 2",
      speed: 3600,
      maxSpeed: 12000,
      status: "up",
      direction: "forward",
    },
    {
      id: "fan-3",
      slot: "Fan Tray 2",
      name: "Fan 3",
      speed: 3400,
      maxSpeed: 12000,
      status: "up",
      direction: "forward",
    },
    {
      id: "fan-4",
      slot: "Fan Tray 2",
      name: "Fan 4",
      speed: 0,
      maxSpeed: 12000,
      status: "down",
      direction: "forward",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
      case "normal":
        return "bg-green-900 text-green-300";
      case "down":
      case "critical":
        return "bg-red-900 text-red-300";
      case "warning":
        return "bg-yellow-900 text-yellow-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
      case "normal":
        return "🟢";
      case "down":
      case "critical":
        return "🔴";
      case "warning":
        return "🟡";
      default:
        return "⚪";
    }
  };

  const subTabs = [
    { id: "transceiver", label: "Transceiver", icon: Cpu, count: mockTransceivers.length },
    { id: "psu", label: "PSU", icon: Zap, count: mockPSUs.length },
    { id: "thermal", label: "Thermal", icon: Thermometer, count: mockThermal.length },
    { id: "fan", label: "Fan", icon: Wind, count: mockFans.length },
  ];

  const renderTransceiver = () => (
    <div className="space-y-3">
      {mockTransceivers.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          No transceivers found.
        </div>
      ) : (
        mockTransceivers.map((transceiver) => (
          <div
            key={transceiver.id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getStatusIcon(transceiver.status)}</span>
                <div>
                  <div className="font-medium text-white">{transceiver.slot}</div>
                  <div className="text-xs text-gray-400">{transceiver.type}</div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  transceiver.status
                )}`}
              >
                {transceiver.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Vendor:</span>
                <div className="text-white">{transceiver.vendor}</div>
              </div>
              <div>
                <span className="text-gray-400">Part Number:</span>
                <div className="text-white font-mono text-xs">{transceiver.partNumber}</div>
              </div>
              <div>
                <span className="text-gray-400">Serial Number:</span>
                <div className="text-white font-mono text-xs">{transceiver.serialNumber}</div>
              </div>
              {transceiver.wavelength && (
                <div>
                  <span className="text-gray-400">Wavelength:</span>
                  <div className="text-white">{transceiver.wavelength}</div>
                </div>
              )}
              {transceiver.distance && (
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <div className="text-white">{transceiver.distance}</div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderPSU = () => (
    <div className="space-y-3">
      {mockPSUs.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">No PSUs found.</div>
      ) : (
        mockPSUs.map((psu) => (
          <div
            key={psu.id}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getStatusIcon(psu.status)}</span>
                <div>
                  <div className="font-medium text-white">{psu.slot}</div>
                  <div className="text-xs text-gray-400">{psu.model}</div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  psu.status
                )}`}
              >
                {psu.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Vendor:</span>
                <div className="text-white">{psu.vendor}</div>
              </div>
              <div>
                <span className="text-gray-400">Power:</span>
                <div className="text-white font-medium">{psu.power}</div>
              </div>
              <div>
                <span className="text-gray-400">Voltage:</span>
                <div className="text-white">{psu.voltage}</div>
              </div>
              {psu.temperature && (
                <div>
                  <span className="text-gray-400">Temperature:</span>
                  <div className="text-white">{psu.temperature}</div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderThermal = () => (
    <div className="space-y-3">
      {mockThermal.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          No thermal sensors found.
        </div>
      ) : (
        mockThermal.map((thermal) => {
          const tempPercent = (thermal.temperature / thermal.threshold) * 100;
          const tempColor =
            thermal.status === "critical"
              ? "bg-red-600"
              : thermal.status === "warning"
              ? "bg-yellow-600"
              : "bg-green-600";

          return (
            <div
              key={thermal.id}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(thermal.status)}</span>
                  <div>
                    <div className="font-medium text-white">{thermal.sensor}</div>
                    <div className="text-xs text-gray-400">{thermal.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {thermal.temperature}°{thermal.unit === "celsius" ? "C" : "F"}
                  </div>
                  <div className="text-xs text-gray-400">
                    Threshold: {thermal.threshold}°{thermal.unit === "celsius" ? "C" : "F"}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Temperature</span>
                  <span>{tempPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${tempColor}`}
                    style={{ width: `${Math.min(tempPercent, 100)}%` }}
                  />
                </div>
              </div>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    thermal.status
                  )}`}
                >
                  {thermal.status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderFan = () => (
    <div className="space-y-3">
      {mockFans.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">No fans found.</div>
      ) : (
        mockFans.map((fan) => {
          const speedPercent = (fan.speed / fan.maxSpeed) * 100;

          return (
            <div
              key={fan.id}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getStatusIcon(fan.status)}</span>
                  <div>
                    <div className="font-medium text-white">{fan.name}</div>
                    <div className="text-xs text-gray-400">{fan.slot}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {fan.speed.toLocaleString()} RPM
                  </div>
                  <div className="text-xs text-gray-400">
                    Max: {fan.maxSpeed.toLocaleString()} RPM
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Speed</span>
                  <span>{speedPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      fan.status === "up" ? "bg-blue-600" : "bg-red-600"
                    }`}
                    style={{ width: `${speedPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    fan.status
                  )}`}
                >
                  {fan.status.toUpperCase()}
                </span>
                {fan.direction && (
                  <span className="text-xs text-gray-400">
                    Direction: {fan.direction}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "transceiver":
        return renderTransceiver();
      case "psu":
        return renderPSU();
      case "thermal":
        return renderThermal();
      case "fan":
        return renderFan();
      default:
        return renderTransceiver();
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-6">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeSubTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeSubTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sub Tab Content */}
      <div className="pt-4">{renderSubTabContent()}</div>
    </div>
  );
};

export default PeripheralsTab;
