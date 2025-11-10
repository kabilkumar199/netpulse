import React, { useEffect, useState } from "react";
import type { Device } from "../../types";
import DeviceList from "../../components/tables/DeviceList";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchDevices } from "../../store/slices/devicesSlice";
import type { AppDispatch } from "../../store/store";

const DevicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleDeviceSelect = (device: Device) => {
    navigate(`/device/${device.id}`);
  };

  useEffect(() => {
    dispatch(fetchDevices());
  }, []);

  const handleConfigureL2Services = (device: Device) => {
    // Navigate to L2 services configuration
    console.log("Configure L2 Services for:", device.hostname);
  };

  return (
    <>
      <DeviceList
        onDeviceSelect={handleDeviceSelect}
        onConfigureL2Services={handleConfigureL2Services}
      />

      {/* Device details are now a dedicated page at /devices/:id */}
    </>
  );
};

export default DevicesPage;
