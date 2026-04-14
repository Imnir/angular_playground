import { Component } from '@angular/core';
import { HousingLocationInfo } from '../housinglocation';
import { SchedulerTest } from "../scheduler-test/scheduler-test";

@Component({
  selector: 'app-home',
  imports: [SchedulerTest],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" />
        <button class="primary" type="button">Search</button>
      </form>
    </section>
  
    <section class="results">
      <scheduler-test />
    </section>
  `,
  styleUrls: ['./home.css'],
})

export class Home {
  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common';

  housingLocation: HousingLocationInfo = {
    id: 9999,
    name: 'Test Home',
    city: 'Test city',
    state: 'ST',
    photo: `${this.baseUrl}/example-house.jpg`,
    availableUnits: 99,
    wifi: true,
    laundry: false,
  };
}
