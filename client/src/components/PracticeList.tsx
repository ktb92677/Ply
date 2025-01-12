import { useEffect, useState } from 'react';
import { DefaultService } from '../api-client';

interface Practice {
  practiceId?: string;
  name?: string;
  ein?: string;
  owner_name?: string;
}

interface PracticeListProps {
  onPracticeSelect?: (practiceId: string) => void;
}

export function PracticeList({ onPracticeSelect }: PracticeListProps) {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPractices() {
      try {
        setLoading(true);
        setError(null);
        const response = await DefaultService.getV1PlyPracticeList();
        setPractices(response.practices || []);
      } catch (err) {
        setError('Failed to load practices');
        console.error('Error fetching practices:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPractices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Practices</h2>
      <div className="space-y-4">
        {practices.map((practice) => (
          <div 
            key={practice.practiceId} 
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onPracticeSelect?.(practice.practiceId || '')}
          >
            <div className="grid gap-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Practice Name</label>
                <p className="text-lg">{practice.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">EIN</label>
                <p className="text-lg">{practice.ein || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Owner Name</label>
                <p className="text-lg">{practice.owner_name || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 