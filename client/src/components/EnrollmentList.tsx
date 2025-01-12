import { useState, useEffect } from 'react';
import { DefaultService } from '../api-client/services/DefaultService';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Location {
  locationId: string;
  address: string;
}

interface Provider {
  providerId: string;
  name: string;
}

interface Enrollment {
  enrollmentId: string;
  practiceId?: string;
  state: string;
  payer: string;
  status: string;
  locationId: string;
  type: 'group' | 'provider';
  providerId: string;
}

interface EnrollmentFormData {
  state: string;
  payer: string;
  status: string;
  locationId: string;
  type: 'group' | 'provider';
  providerId: string;
}

interface Activity {
  activityId: string;
  enrollmentId: string;
  message: string;
}

interface Props {
  practiceId: string;
}

export function EnrollmentList({ practiceId }: Props) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormData>({
    state: '',
    payer: '',
    status: 'drafted',
    locationId: '',
    type: 'group',
    providerId: ''
  });

  useEffect(() => {
    fetchEnrollments();
    fetchLocations();
    fetchProviders();
  }, [practiceId]);

  const fetchLocations = async () => {
    try {
      const response = await DefaultService.getV1PlyPracticeLocation(practiceId);
      setLocations(response.locations || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await DefaultService.getV1PlyPracticeProvider(practiceId);
      setProviders(response.providers || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await DefaultService.getV1PlyPracticeEnrollment(practiceId);
      setEnrollments(response.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchActivities = async (enrollmentId: string) => {
    try {
      const response = await DefaultService.getV1PlyEnrollmentActivity(enrollmentId);
      const activities = (response.activities || []).map(activity => ({
        activityId: activity.activityId || '',
        enrollmentId: activity.enrollmentId || '',
        message: activity.message || ''
      }));
      setActivities(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.locationId === locationId);
    return location ? location.address : locationId;
  };

  const getProviderName = (providerId: string) => {
    const provider = providers.find(prov => prov.providerId === providerId);
    return provider ? provider.name : providerId;
  };

  const handleAddEnrollment = async () => {
    try {
      if (formData.type === 'provider' && !formData.providerId) {
        alert('Please select a provider');
        return;
      }
      
      if (!formData.type) {
        alert('Please select a type (group or provider)');
        return;
      }
      
      console.log('Submitting enrollment with type:', formData.type);
      
      await DefaultService.postV1PlyEnrollment({
        practiceId: practiceId,
        state: formData.state,
        payer: formData.payer,
        status: 'drafted',
        locationId: formData.locationId,
        type: formData.type,
        providerId: formData.providerId
      });
      setIsAddModalOpen(false);
      setFormData({
        state: '',
        payer: '',
        status: 'drafted',
        locationId: '',
        type: 'group',
        providerId: ''
      });
      fetchEnrollments();
    } catch (error) {
      console.error('Error adding enrollment:', error);
    }
  };

  const handleEditEnrollment = async () => {
    if (!selectedEnrollment) return;
    
    try {
      if (formData.type === 'provider' && !formData.providerId) {
        alert('Please select a provider');
        return;
      }

      await DefaultService.postV1PlyEnrollment1(selectedEnrollment.enrollmentId, {
        enrollmentId: selectedEnrollment.enrollmentId,
        practiceId: practiceId,
        state: formData.state,
        payer: formData.payer,
        status: formData.status,
        locationId: formData.locationId,
        type: formData.type,
        providerId: formData.providerId
      });
      setIsEditModalOpen(false);
      setSelectedEnrollment(null);
      setFormData({
        state: '',
        payer: '',
        status: '',
        locationId: '',
        type: 'group',
        providerId: ''
      });
      fetchEnrollments();
    } catch (error) {
      console.error('Error updating enrollment:', error);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      await DefaultService.deleteV1PlyEnrollment(enrollmentId);
      fetchEnrollments();
    } catch (error) {
      console.error('Error deleting enrollment:', error);
    }
  };

  const openEditModal = (enrollment: Enrollment) => {
    const type = enrollment.type === 'provider' ? 'provider' : 'group';
    
    setSelectedEnrollment(enrollment);
    setFormData({
      state: enrollment.state,
      payer: enrollment.payer,
      status: enrollment.status,
      locationId: enrollment.locationId,
      type: type,
      providerId: enrollment.providerId
    });
    setIsEditModalOpen(true);
    fetchActivities(enrollment.enrollmentId);
  };

  const formatType = (type: 'group' | 'provider' | undefined): string => {
    if (!type) return '-';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Enrollments</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">State</th>
              <th className="px-6 py-3 text-left">Payer</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Provider</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.enrollmentId} className="border-b">
                <td className="px-6 py-4">{enrollment.state}</td>
                <td className="px-6 py-4">{enrollment.payer}</td>
                <td className="px-6 py-4">{enrollment.status}</td>
                <td className="px-6 py-4">{formatType(enrollment.type)}</td>
                <td className="px-6 py-4">{getLocationName(enrollment.locationId)}</td>
                <td className="px-6 py-4">{enrollment.type === 'provider' ? getProviderName(enrollment.providerId) : '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEditModal(enrollment)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteEnrollment(enrollment.enrollmentId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        <Plus size={20} /> Add Enrollment
      </button>

      {/* Add Enrollment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Enrollment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payer</label>
                <input
                  type="text"
                  value={formData.payer}
                  onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location.locationId} value={location.locationId}>
                      {location.address}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      value="group"
                      checked={formData.type === 'group'}
                      onChange={() => {
                        setFormData(prev => ({ ...prev, type: 'group', providerId: '' }));
                      }}
                      className="form-radio"
                    />
                    Group
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      value="provider"
                      checked={formData.type === 'provider'}
                      onChange={() => {
                        setFormData(prev => ({ ...prev, type: 'provider' }));
                      }}
                      className="form-radio"
                    />
                    Provider
                  </label>
                </div>
              </div>
              {formData.type === 'provider' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Provider</label>
                  <select
                    value={formData.providerId}
                    onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select a provider</option>
                    {providers.map(provider => (
                      <option key={provider.providerId} value={provider.providerId}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({
                      state: '',
                      payer: '',
                      status: 'drafted',
                      locationId: '',
                      type: 'group',
                      providerId: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEnrollment}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Enrollment Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[800px]">
            <h2 className="text-xl font-bold mb-4">Edit Enrollment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payer</label>
                <input
                  type="text"
                  value={formData.payer}
                  onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Draft">Draft</option>
                  <option value="Working">Working</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location.locationId} value={location.locationId}>
                      {location.address}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      value="group"
                      checked={formData.type === 'group'}
                      onChange={() => {
                        setFormData(prev => ({ ...prev, type: 'group', providerId: '' }));
                      }}
                      className="form-radio"
                    />
                    Group
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      value="provider"
                      checked={formData.type === 'provider'}
                      onChange={() => {
                        setFormData(prev => ({ ...prev, type: 'provider' }));
                      }}
                      className="form-radio"
                    />
                    Provider
                  </label>
                </div>
              </div>
              {formData.type === 'provider' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Provider</label>
                  <select
                    value={formData.providerId}
                    onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select a provider</option>
                    {providers.map(provider => (
                      <option key={provider.providerId} value={provider.providerId}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Activities Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Activities</h3>
                <div className="bg-gray-50 rounded-lg">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr key={activity.activityId} className="border-b">
                          <td className="px-4 py-2">{activity.message}</td>
                        </tr>
                      ))}
                      {activities.length === 0 && (
                        <tr>
                          <td className="px-4 py-2 text-gray-500">No activities yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedEnrollment(null);
                    setFormData({
                      state: '',
                      payer: '',
                      status: '',
                      locationId: '',
                      type: 'group',
                      providerId: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditEnrollment}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 