import { useEffect, useState } from 'react';
import { DefaultService } from '../api-client';
import { CheckCircle } from 'lucide-react';

interface Task {
  taskId?: string;
  practiceId?: string;
  message?: string;
  status?: string;
}

interface TaskListProps {
  practiceId: string;
}

export function TaskList({ practiceId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);
      const response = await DefaultService.getV1PlyPracticeTask(practiceId);
      setTasks(response.tasks || []);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (practiceId) {
      fetchTasks();
    }
  }, [practiceId]);

  const handleCompleteTask = async (task: Task) => {
    if (!task.taskId) return;
    
    try {
      await DefaultService.postV1PlyTask(task.taskId, {
        taskId: task.taskId,
        practiceId: task.practiceId,
        message: task.message,
        status: 'Completed'
      });
      await fetchTasks(); // Refresh the task list
    } catch (err) {
      setError('Failed to complete task');
      console.error('Error completing task:', err);
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

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Message</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.taskId} className="border-b last:border-b-0">
                    <td className="py-3 px-4">{task.message}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleCompleteTask(task)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                      No tasks available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 