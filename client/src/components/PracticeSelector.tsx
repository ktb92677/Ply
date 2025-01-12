import { useEffect, useState } from 'react';
import { DefaultService } from '../api-client';
import { ChevronDown, Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface Practice {
  practiceId?: string;
  name?: string;
}

interface PracticeSelectorProps {
  onPracticeSelect: (practiceId: string) => void;
  selectedPracticeId: string | null;
  refreshKey?: number;
}

interface CreatePracticeForm {
  name: string;
  ein: string;
  ownerName: string;
}

export function PracticeSelector({ onPracticeSelect, selectedPracticeId, refreshKey = 0 }: PracticeSelectorProps) {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<CreatePracticeForm>({
    name: '',
    ein: '',
    ownerName: ''
  });

  useEffect(() => {
    async function fetchPractices() {
      try {
        setLoading(true);
        const response = await DefaultService.getV1PlyPracticeList();
        setPractices(response.practices || []);
      } catch (err) {
        console.error('Error fetching practices:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPractices();
  }, [refreshKey]);

  async function handleCreatePractice(e: React.FormEvent) {
    e.preventDefault();
    try {
      await DefaultService.postV1PlyPractice({
        name: formData.name,
        ein: formData.ein,
        owner_name: formData.ownerName
      });
      
      // Reset form and close dialog
      setFormData({ name: '', ein: '', ownerName: '' });
      setShowCreateDialog(false);
      
      // Refresh practices list
      const response = await DefaultService.getV1PlyPracticeList();
      setPractices(response.practices || []);
    } catch (err) {
      console.error('Failed to create practice:', err);
    }
  }

  const selectedPractice = practices.find(p => p.practiceId === selectedPracticeId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-64 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
      >
        <span className="text-sm font-medium truncate">
          {loading ? 'Loading...' : 
           selectedPractice ? selectedPractice.name : 'Select a practice'}
        </span>
        <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <div className="py-1">
            {practices.map((practice) => (
              <button
                key={practice.practiceId}
                onClick={() => {
                  onPracticeSelect(practice.practiceId || '');
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                {practice.name}
              </button>
            ))}
            <div className="border-t my-1" />
            <button
              onClick={() => {
                setShowCreateDialog(true);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-blue-600 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Practice
            </button>
          </div>
        </div>
      )}

      {/* Create Practice Dialog */}
      <Dialog.Root open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Create New Practice
            </Dialog.Title>
            
            <form onSubmit={handleCreatePractice}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Practice Name
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    EIN
                    <input
                      type="text"
                      value={formData.ein}
                      onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Owner Name
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Practice
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
} 