import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
  fileName: string;
}

export function DocumentViewerModal({ isOpen, onClose, documentId, fileName }: DocumentViewerModalProps) {
  if (!documentId) return null;

  const documentUrl = `/v1/ply/document/${documentId}`;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-[800px] h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {fileName}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-[calc(100%-4rem)]">
            <iframe
              src={documentUrl}
              className="w-full h-full rounded border"
              title={fileName}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 