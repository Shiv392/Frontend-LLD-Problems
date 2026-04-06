import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MultiselectDropdown } from './easy/multiselect-dropdown/multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule ,RouterOutlet, MultiselectDropdown],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-frontend');
  public common_service = inject(CommonService);

  public options : {label : string, value : string}[] = this.common_service.dropdown_options;

  public selected_field : any;
}
