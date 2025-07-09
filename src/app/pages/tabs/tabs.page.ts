import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule, 
  ],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {}
