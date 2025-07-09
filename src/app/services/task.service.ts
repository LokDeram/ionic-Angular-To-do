import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'https://server-1-t93s.onrender.com/api/tasks-management';

  constructor(private http: HttpClient) {}

  addTask(userId: string, title: string, description: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-task`, {
      userId,
      title,
      description
    });
  }

  getTasks(userId: string): Observable<{ userId: string, tasks: Task[] }> {
    return this.http.get<{ userId: string, tasks: Task[] }>(`${this.baseUrl}/get-tasks/${userId}`);
  }

  updateTask(task: Partial<Task> & { userId: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-task`, task);
  }

  deleteTask(userId: string, taskId: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/remove-task`, {
      body: { userId, taskId }
    });
  }
}
