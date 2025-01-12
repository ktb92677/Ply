import { useState, useEffect } from 'react';
import { DefaultService } from '../api-client/services/DefaultService';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Provider {
  providerId: string;
  practiceId?: string;
  name: string;
  ssn: string;
}

interface ProviderFormData {
  name: string;
  ssn: string;
}

interface Props {
  practiceId: string;
}

export function ProviderList({ practiceId }: Props) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState<ProviderFormData>({
    name: '',
    ssn: ''
  });

  useEffect(() => {
    fetchProviders();
  }, [practiceId]);

  const fetchProviders = async () => {
    try {
      const response = await DefaultService.getV1PlyPracticeProvider(practiceId);
      setProviders(response.providers || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleAddProvider = async () => {
    try {
      await DefaultService.postV1PlyProvider({
        practiceId: practiceId,
        name: formData.name,
        ssn: formData.ssn
      });
      setIsAddModalOpen(false);
      setFormData({ name: '', ssn: '' });
      fetchProviders();
    } catch (error) {
      console.error('Error adding provider:', error);
    }
  };

  const handleEditProvider = async () => {
    if (!selectedProvider) return;
    try {
      await DefaultService.postV1PlyProvider1(selectedProvider.providerId, {
        providerId: selectedProvider.providerId,
        practiceId: practiceId,
        name: formData.name,
        ssn: formData.ssn
      });
      setIsEditModalOpen(false);
      setSelectedProvider(null);
      setFormData({ name: '', ssn: '' });
      fetchProviders();
    } catch (error) {
      console.error('Error updating provider:', error);
    }
  };

  const handleDeleteProvider = async (providerId: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    try {
      await DefaultService.deleteV1PlyProvider(providerId);
      fetchProviders();
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  };

  const openEditModal = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormData({
      name: provider.name,
      ssn: provider.ssn
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Providers</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">SSN</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.providerId} className="border-b">
                <td className="px-6 py-4">{provider.name}</td>
                <td className="px-6 py-4">{provider.ssn}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEditModal(provider)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteProvider(provider.providerId)}
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
        <Plus size={20} /> Add Provider
      </button>

      {/* Add Provider Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Provider</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SSN</label>
                <input
                  type="text"
                  value={formData.ssn}
                  onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({ name: '', ssn: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProvider}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Provider</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SSN</label>
                <input
                  type="text"
                  value={formData.ssn}
                  onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedProvider(null);
                    setFormData({ name: '', ssn: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProvider}
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