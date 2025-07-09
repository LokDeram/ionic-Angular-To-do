import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-tache-form',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './tache-form.page.html',
  styleUrls: ['./tache-form.page.scss'],
})
export class TacheFormPage implements OnInit {
  title: string = '';
  description: string = '';
  isDone: boolean = false;
  taskId?: string;
  isEditing: boolean = false;

  constructor(
    private taskService: TaskService,
    private stateService: StateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  ionViewWillEnter() {
    this.initializeForm();
  }

  private initializeForm() {
    const currentUser = this.stateService.currentUser;
    if (!currentUser?.userId) {
      alert('Utilisateur non connecté');
      this.router.navigate(['/login']);
      return;
    }

    const storedTask = localStorage.getItem('editTask');
    if (storedTask) {
      const task = JSON.parse(storedTask);
      if (task.taskId) {
        this.title = task.title;
        this.description = task.description;
        this.isDone = task.isDone || false;
        this.taskId = task.taskId;
        this.isEditing = true;
      } else {
        this.resetForm();
      }
      localStorage.removeItem('editTask');
    } else {
      this.resetForm();
    }
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    this.isDone = false;
    this.taskId = undefined;
    this.isEditing = false;
  }

  onSubmit() {
    const currentUser = this.stateService.currentUser;
    if (!currentUser?.userId) {
      alert('Utilisateur non connecté');
      return;
    }

    if (!this.title.trim() || !this.description.trim()) {
      alert("Titre et description requis");
      return;
    }

    if (this.isEditing && this.taskId) {
      this.taskService.updateTask({
        userId: currentUser.userId,
        taskId: this.taskId,
        title: this.title.trim(),
        description: this.description.trim(),
        isDone: this.isDone
      }).subscribe({
        next: () => {
          alert("Tâche modifiée avec succès");
          this.loadTasksAndNavigate();
        },
        error: () => alert("Erreur lors de la modification")
      });
    } else {
      this.taskService.addTask(currentUser.userId, this.title.trim(), this.description.trim()).subscribe({
        next: () => {
          alert("Tâche créée avec succès");
          this.loadTasksAndNavigate();
        },
        error: () => alert("Erreur lors de la création")
      });
    }
  }

  private loadTasksAndNavigate() {
    const currentUser = this.stateService.currentUser;
    if (currentUser?.userId) {
      this.taskService.getTasks(currentUser.userId).subscribe({
        next: (response) => {
          this.stateService.setTasks(response.tasks);
          this.router.navigate(['/tabs/mes-taches']);
        },
        error: () => {
          this.router.navigate(['/tabs/mes-taches']);
        }
      });
    }
  }

  onCancel() {
    localStorage.removeItem('editTask');
    this.router.navigate(['/tabs/mes-taches']);
  }
}