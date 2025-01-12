import { useEffect, useState } from 'react';
import { DefaultService } from '../api-client';
import { Upload, Eye, Trash2, Save } from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';
import { Toast } from './Toast';
import { cn } from '../lib/utils';

interface Practice {
  practiceId?: string;
  name?: string;
  ein?: string;
  owner_name?: string;
}

interface Document {
  documentId?: string;
  practiceId?: string;
  file_name?: string;
  storage_path?: string;
}

type Tab = 'practice' | 'documents';

export function GroupInformation({ 
  practiceId,
  onPracticeUpdate
}: { 
  practiceId: string;
  onPracticeUpdate?: () => void;
}) {
  const [practice, setPractice] = useState<Practice | null>(null);
  const [editedPractice, setEditedPractice] = useState<Practice | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('practice');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [practiceResponse, documentsResponse] = await Promise.all([
          DefaultService.getV1PlyPractice(practiceId),
          DefaultService.getV1PlyPracticeDocument(practiceId)
        ]);
        setPractice(practiceResponse);
        setEditedPractice(practiceResponse);
        setDocuments(documentsResponse.documents || []);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (practiceId) {
      fetchData();
    }
  }, [practiceId]);

  const handleSavePractice = async () => {
    if (!editedPractice) return;

    try {
      setSaving(true);
      setError(null);
      await DefaultService.postV1PlyPractice1(practiceId, editedPractice);
      setPractice(editedPractice);
      setToast({ message: 'Practice information saved successfully', type: 'success' });
      onPracticeUpdate?.();
    } catch (err) {
      setError('Failed to save practice information');
      setToast({ message: 'Failed to save practice information', type: 'error' });
      console.error('Error saving practice:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Practice, value: string) => {
    setEditedPractice(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Convert file to generic blob
      const fileData = await file.arrayBuffer();
      const blob = new Blob([fileData], { type: 'application/octet-stream' });

      // Use the generated API client
      await DefaultService.postV1PlyPracticeUpload(practiceId, {
        file: blob,
        fileName: file.name
      });

      // Refresh documents list
      const documentsResponse = await DefaultService.getV1PlyPracticeDocument(practiceId);
      setDocuments(documentsResponse.documents || []);

      setToast({ message: 'Document uploaded successfully', type: 'success' });
    } catch (err) {
      setError('Failed to upload document');
      setToast({ message: 'Failed to upload document', type: 'error' });
      console.error('Error uploading document:', err);
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await DefaultService.deleteV1PlyDocument(documentId);
      
      // Refresh documents list
      const documentsResponse = await DefaultService.getV1PlyPracticeDocument(practiceId);
      setDocuments(documentsResponse.documents || []);
      setToast({ message: 'Document deleted successfully', type: 'success' });
    } catch (err) {
      setError('Failed to delete document');
      setToast({ message: 'Failed to delete document', type: 'error' });
      console.error('Error deleting document:', err);
    }
  };

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

  if (!practice || !editedPractice) {
    return (
      <div className="p-4 text-gray-600">
        No practice information available
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Group Information</h2>
      </div>

      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('practice')}
            className={cn(
              'px-4 py-2 font-medium text-sm relative',
              activeTab === 'practice'
                ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Practice Information
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={cn(
              'px-4 py-2 font-medium text-sm relative',
              activeTab === 'documents'
                ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Documents
          </button>
        </div>
      </div>

      {activeTab === 'practice' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Practice Name</label>
              <input
                type="text"
                value={editedPractice.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">EIN</label>
              <input
                type="text"
                value={editedPractice.ein || ''}
                onChange={(e) => handleInputChange('ein', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Owner Name</label>
              <input
                type="text"
                value={editedPractice.owner_name || ''}
                onChange={(e) => handleInputChange('owner_name', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSavePractice}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">File Name</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.documentId} className="border-b last:border-b-0">
                        <td className="py-3 px-4">{doc.file_name}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedDocument(doc)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <button
                              onClick={() => doc.documentId && handleDeleteDocument(doc.documentId)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={2} className="py-4 px-4 text-center text-gray-500">
                          No documents available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Document'}
              </label>
            </div>
          </div>
        </div>
      )}

      <DocumentViewerModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        documentId={selectedDocument?.documentId || null}
        fileName={selectedDocument?.file_name || ''}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 