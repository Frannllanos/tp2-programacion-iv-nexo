import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { ModalComponent } from './shared/components/modal/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
