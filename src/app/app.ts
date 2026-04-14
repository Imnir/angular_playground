import {Component, NgModule} from '@angular/core';
import {Home} from './home/home';
import { DxSchedulerModule } from "devextreme-angular/ui/scheduler";
import { DxPopupModule } from 'devextreme-angular';

@Component({
  selector: 'app-root',
  imports: [Home],
  template: `
      <main>
        <header class="brand-name">
          <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
        </header>
        <section class="content">
          <app-home />
        </section>
      </main>
  `,
  styleUrls: ['./app.css'],
})

export class App {}

@NgModule({
  declarations: [],
  imports: [DxSchedulerModule, App, DxPopupModule],
  bootstrap: [],
})
export class AppModule {}