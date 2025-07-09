import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { StateService } from '../../services/state.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mes-taches',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './mes-taches.page.html',
  styleUrls: ['./mes-taches.page.scss'],
})
export class MesTachesPage implements OnInit, OnDestroy {
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
        this.tasks = this.stateService.getMyTasks();
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
        alert("Erreur lors du chargement");
        this.stateService.setLoading(false);
      }
    });
  }

  logout() {
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    this.stateService.logout(); 
    localStorage.removeItem('user'); 
    this.router.navigate(['/login']); 
  }
}

  markAsDone(task: Task) {
    const currentUser = this.stateService.currentUser;
    if (!currentUser?.userId) return;

    this.taskService.updateTask({
      userId: currentUser.userId,
      taskId: task.taskId!,
      isDone: true
    }).subscribe({
      next: () => {
        const updatedTask = { ...task, isDone: true };
        this.stateService.updateTask(updatedTask);
      },
      error: () => alert("Erreur")
    });
  }

  editTask(task: Task) {
    if (task.taskId && task.isOwner) {
      localStorage.setItem('editTask', JSON.stringify(task));
      this.router.navigate(['/tabs/tache-form']);
    }
  }

  deleteTask(task: Task) {
    if (confirm("Supprimer cette tâche ?")) {
      const currentUser = this.stateService.currentUser;
      if (!currentUser?.userId || !task.taskId) return;

      this.taskService.deleteTask(currentUser.userId, task.taskId).subscribe({
        next: () => {
          this.stateService.removeTask(task.taskId!);
        },
        error: () => alert("Erreur")
      });
    }
  }
}