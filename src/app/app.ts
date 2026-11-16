import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Nav } from './layout/nav/nav';
import { Footer } from './layout/footer/footer';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Nav,
    Footer,
    ToastModule
  ],
  templateUrl: './app.html'
})
export class App {}
