import { useState, useEffect } from 'react';
import { DefaultService } from '../api-client/services/DefaultService';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Location {
  locationId: string;
  practiceId?: string;
  address: string;
}

interface LocationFormData {
  address: string;
}

interface Props {
  practiceId: string;
}

export function LocationList({ practiceId }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<LocationFormData>({
    address: ''
  });

  useEffect(() => {
    fetchLocations();
  }, [practiceId]);

  const fetchLocations = async () => {
    try {
      const response = await DefaultService.getV1PlyPracticeLocation(practiceId);
      setLocations(response.locations || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleAddLocation = async () => {
    try {
      await DefaultService.postV1PlyLocation({
        practiceId,
        address: formData.address
      });
      setIsAddModalOpen(false);
      setFormData({ address: '' });
      fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleEditLocation = async () => {
    if (!selectedLocation) return;
    try {
      await DefaultService.postV1PlyLocation1(selectedLocation.locationId, {
        locationId: selectedLocation.locationId,
        practiceId: practiceId,
        address: formData.address
      });
      setIsEditModalOpen(false);
      setSelectedLocation(null);
      setFormData({ address: '' });
      fetchLocations();
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await DefaultService.deleteV1PlyLocation(locationId);
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const openEditModal = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      address: location.address
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Locations</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.locationId} className="border-b">
                <td className="px-6 py-4">{location.address}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEditModal(location)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(location.locationId)}
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
        <Plus size={20} /> Add Location
      </button>

      {/* Add Location Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({ address: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLocation}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Location Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedLocation(null);
                    setFormData({ address: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditLocation}
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