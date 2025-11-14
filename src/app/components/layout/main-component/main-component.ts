import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar-component/navbar-component';

@Component({
  selector: 'app-main-component',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css'
})
export class MainComponent {

}
