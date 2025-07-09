import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  user$: Observable<User | null> = this.userSubject.asObservable();
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get currentTasks(): Task[] {
    return this.tasksSubject.value;
  }

  setUser(user: User | null): void {
    this.userSubject.next(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  setTasks(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
  }

  addTask(task: Task): void {
    const currentTasks = this.currentTasks;
    this.setTasks([...currentTasks, task]);
  }

  updateTask(updatedTask: Task): void {
    const currentTasks = this.currentTasks;
    const index = currentTasks.findIndex(t => t.taskId === updatedTask.taskId);
    if (index !== -1) {
      currentTasks[index] = updatedTask;
      this.setTasks([...currentTasks]);
    }
  }

  removeTask(taskId: string): void {
    const currentTasks = this.currentTasks;
    const filteredTasks = currentTasks.filter(t => t.taskId !== taskId);
    this.setTasks(filteredTasks);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  getMyTasks(): Task[] {
    const userId = this.currentUser?.userId;
    return this.currentTasks.filter(task => task.isOwner && !task.isDone);
  }

  getOtherTasks(): Task[] {
    return this.currentTasks.filter(task => !task.isOwner && !task.isDone);
  }

  getArchivedTasks(): Task[] {
    return this.currentTasks.filter(task => task.isDone);
  }

  logout(): void {
    this.setUser(null);
    this.setTasks([]);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userSubject.next(user);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  }
}