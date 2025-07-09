import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { StateService } from '../../services/state.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-archivees',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './archivees.page.html',
  styleUrls: ['./archivees.page.scss'],
})
export class ArchiveesPage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private stateService: StateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.stateService.tasks$.subscribe(allTasks => {
        this.tasks = this.stateService.getArchivedTasks();
      })
    );

    this.subscription.add(
      this.stateService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    this.loadTasks();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.loadTasks();
  }

  loadTasks() {
    const currentUser = this.stateService.currentUser;
    if (!currentUser?.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.stateService.setLoading(true);
    this.taskService.getTasks(currentUser.userId).subscribe({
      next: (response) => {
        this.stateService.setTasks(response.tasks);
        this.stateService.setLoading(false);
      },
      error: (error) => {
        console.error('Erreur:', error);
        alert("Erreur lors du chargement des tâches archivées");
        this.stateService.setLoading(false);
      }
    });
  }

  reactivateTask(task: Task) {
    const currentUser = this.stateService.currentUser;
    if (!currentUser?.userId || !task.isOwner) return;

    this.taskService.updateTask({
      userId: currentUser.userId,
      taskId: task.taskId!,
      isDone: false
    }).subscribe({
      next: () => {
        const updatedTask = { ...task, isDone: false };
        this.stateService.updateTask(updatedTask);
        alert("Tâche réactivée");
      },
      error: () => alert("Erreur lors de la réactivation")
    });
  }
}