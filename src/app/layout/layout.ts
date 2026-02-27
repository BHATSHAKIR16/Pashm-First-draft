import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header';
import { FooterComponent } from './components/footer';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent { }
