import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [
    NgOptimizedImage
  ],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
