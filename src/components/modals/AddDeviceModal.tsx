import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addDevice } from '../../store/slices/devicesSlice';
import { useCreateDeviceMutation } from '../../helpers/api/devicesApiHelper';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  ipAddress: string;
  username: string;
  password: string;
}

interface FormErrors {
  ipAddress?: string;
  username?: string;
  password?: string;
  general?: string;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [createDevice, { isLoading }] = useCreateDeviceMutation();
  
  const [formData, setFormData] = useState<FormData>({
    ipAddress: '',
    username: 'admin@exaware.com',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // IP Address validation
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = 'IP Address is required';
    } else {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ipAddress)) {
        newErrors.ipAddress = 'Please enter a valid IP address';
      }
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create device data
      const deviceData = {
        hostname: formData.ipAddress,
        ipAddresses: [formData.ipAddress],
        vendor: 'Unknown',
        model: 'Unknown',
        os: 'Unknown',
        status: 'unknown' as const,
        labels: [],
        tags: [],
        lastSeen: new Date(),
        credentials: [],
        roles: [],
        interfaces: [],
        dependencies: [],
        monitors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Use RTK Query mutation
      const result = await createDevice(deviceData).unwrap();
      
      // Also update local state
      dispatch(addDevice(result));
      
      // Reset form and close modal
      setFormData({
        ipAddress: '',
        username: 'admin@exaware.com',
        password: '',
      });
      onClose();
      
    } catch (error: any) {
      console.error('Error creating device:', error);
      setErrors({
        general: error?.data?.message || 'Failed to add device. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        ipAddress: '',
        username: 'admin@exaware.com',
        password: '',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0  bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Device
            </h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* General Error */}
            {errors.general && (
              <div className="mb-4 flex items-center space-x-2 rounded-md bg-red-50 p-3 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            {/* IP Address Field */}
            <div className="mb-4">
              <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-1">
                IP Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ipAddress"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleInputChange}
                placeholder="Enter IP address (e.g., 192.168.100.18)"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ipAddress ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.ipAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.ipAddress}</p>
              )}
            </div>

            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
