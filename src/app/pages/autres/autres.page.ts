import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { StateService } from '../../services/state.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-autres',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './autres.page.html',
  styleUrls: ['./autres.page.scss'],
})
export class AutresPage implements OnInit, OnDestroy {
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
        this.tasks = this.stateService.getOtherTasks();
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
        alert("Erreur lors du chargement des tâches");
        this.stateService.setLoading(false);
      }
    });
  }
}