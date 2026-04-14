import { Component, input } from '@angular/core';
import { DxoSchedulerEditingComponent, DxSchedulerModule } from "devextreme-angular/ui/scheduler";
import { AppointmentDto } from '../appointment';
import { locale } from 'devextreme/localization';
import deMessages from 'devextreme/localization/messages/de.json';
import { loadMessages } from 'devextreme/localization';
import { AppointmentFormOpeningEvent } from 'devextreme/ui/scheduler';
import { CommonModule } from '@angular/common';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { DxCheckBoxModule } from 'devextreme-angular';
import { ValueChangedEvent } from 'devextreme/ui/check_box';

type Options = {
  id: string;
  text: string;
};

type RepeatType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'lastDayOfMonth';

type Weekday = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

interface RecurrenceFormValue {
  repeatType: RepeatType;
  interval?: number;
  until: Date;
  weekdays?: Weekday[];
  startDate: Date;
}

@Component({
  selector: 'scheduler-test',
  imports: [DxSchedulerModule, CommonModule, DxoSchedulerEditingComponent, DxCheckBoxModule],
  templateUrl: "./scheduler-test.html",
  styleUrls: ['./scheduler-test.css'],
})

export class SchedulerTest {
  appointments: AppointmentDto[] = [];
  schedulerForm: any;

  popupOptions: DxoSchedulerEditingComponent["popup"] = {
    visible: false,
    title: 'Paket Report erstellen',
  };

  repeatOptions: Options[] = [
    { id: 'daily', text: 'Täglich' },
    { id: 'weekly', text: 'Wöchentlich' },
    { id: 'monthly', text: 'Monatlich' },
    { id: 'lastDayOfMonth', text: 'Monatlich am letzten Monatstag' },
    { id: 'yearly', text: 'Jährlich' },
  ];
  
  weekdayOptions: Options[] = [
    { id: 'MO', text: 'Mo' },
    { id: 'TU', text: 'Di' },
    { id: 'WE', text: 'Mi' },
    { id: 'TH', text: 'Do' },
    { id: 'FR', text: 'Fr' },
    { id: 'SA', text: 'Sa' },
    { id: 'SU', text: 'So' },
  ];
  
  repeatTypeExplanation: Options[] = [
    { id: 'daily', text: 'Auswertung an gewählten Tagen zur Beginn-Uhrzeit bezogen auf den aktuellen Monat vom 1. bis zum Ausführtag.' },
    { id: 'weekly', text: 'Auswertung wöchentlich zur Beginn-Uhrzeit bezogen auf die vorherige Woche.' },
    { id: 'monthly', text: 'Auswertung monatlich zur Beginn-Uhrzeit bezogen auf den aktuellen Monat (L) oder den Vormonat (V). Auswertung des ganzen Monats (auch Zukunft).' },
    { id: 'lastDayOfMonth', text: 'Auswertung monatlich am letzten Tag des Monats zur Beginn-Uhrzeit für den laufenden Monat.' },
    { id: 'yearly', text: 'Auswertung jährlich zur Beginn-Uhrzeit bezogen auf das die letzten 12 Monate endent beim vormonate der Ausführung.' },
  ];

  constructor() {
    this.appointments = [
      {
        id: 1,
        isActive: true,
        text: "Täglicher Termin",
        startDate: new Date(),
        endDate: new Date(),
        repeatType: 'daily',
        period: 'Vormonat (V)',
        recurrenceRule: "FREQ=WEEKLY;COUNT=5",
        description: "Täglicher Termin für 5 Tage",
        weekdays: ['MO', 'WE', 'FR'],
      }
    ];
    loadMessages(deMessages);
    locale('de');
  }

  onAppointmentFormOpening(e: AppointmentFormOpeningEvent) {
    const appointment = e.appointmentData;
    this.schedulerForm = e.form;
    if(!appointment) {
      return;
    }
  
    if(!appointment['id']) {
      const start = new Date(appointment.startDate!);
      start.setHours(8, 0, 0, 0);

      appointment['repeatType'] ??= 'monthly';
      appointment['period'] ??= 'Laufender Monat (L)';
      appointment.text ??= this.repeatOptions.find((o) => o.id === appointment['repeatType'])?.text + " " + appointment['period'];
      appointment.description ??= this.repeatTypeExplanation.find((o) => o.id === appointment['repeatType'])?.text ?? '';
      appointment.startDate = start;
      appointment.endDate = undefined;
      appointment.recurrenceRule ??= '';
      appointment['weekdays'] ??= ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
      this.schedulerForm.option('formData', appointment);
    }
  }

  onChange = (e: FieldDataChangedEvent) =>{
    const form = e.component;
    const data = form.option('formData');

    switch (e.dataField) {
      case 'repeatType':
        const repeatType = e.value as RepeatType;
        const showWeekdays = repeatType === 'daily';
        const enablePeriod = repeatType === 'monthly';

        form.itemOption('weekdaysItem', 'visible', showWeekdays);

        const prevPeriodOptions = form.itemOption('period').editorOptions || {};
        form.itemOption('period', 'editorOptions', {
          ...prevPeriodOptions,
          disabled: !enablePeriod
        });

        if (showWeekdays) {
          form.updateData('weekdays', ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']);
        }

        if (!enablePeriod) {
          form.updateData('period', 'Laufender Monat (L)');
        }
        form.updateData('description', this.repeatTypeExplanation.find((o) => o.id === repeatType)?.text ?? '');
        this.updateSubject(form);
        break;
      case 'period':
        this.updateSubject(form);
        break;
    }  
  }

  updateSubject(form: any) {
    const data = form.option('formData');
    const repeatLabel = this.repeatOptions.find(o => o.id === data.repeatType)?.text ?? '';
    const period = data.period ?? '';
    let text = repeatLabel;
    if (period) {
      text += ` ${period}`;
    }
    form.updateData('text', text.trim());
  }

  onWeekdayChanged (dayId: string, e: ValueChangedEvent) {
    if (!this.schedulerForm) return;

    let weekdays: string[] = this.schedulerForm.option('formData').weekdays || [];

    if (e) {
      weekdays = [...weekdays, dayId];
    } else {
      weekdays = weekdays.filter(day => day !== dayId);
    }

    this.schedulerForm.updateData('weekdays', weekdays);
  };

  isWeekdaySelected (id: string): boolean {
    const formData = this.schedulerForm?.option('formData');
    return Array.isArray(formData?.weekdays) && formData.weekdays.includes(id);
  };

  toUtcUntil(date: Date): string {
    const d = new Date(date);

    // Ende des Tages, damit "bis Datum" für Nutzer natürlich wirkt
    d.setHours(23, 59, 59, 0);

    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mi = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');

    return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
  }

  buildRecurrenceRule(input: RecurrenceFormValue): string {
    const parts: string[] = [];
    const interval = input.interval && input.interval > 0 ? input.interval : 1;

    parts.push(`FREQ=${input.repeatType.toUpperCase()}`);
    if (interval > 1) {
      parts.push(`INTERVAL=${interval}`);
    }

    parts.push(`UNTIL=${this.toUtcUntil(input.until)}`);

    switch (input.repeatType) {
      case 'daily':
        break;

      case 'weekly':
        if (!input.weekdays?.length) {
          throw new Error('Für wöchentliche Wiederholung werden Wochentage benötigt.');
        }
        parts.push(`BYDAY=${input.weekdays.join(',')}`);
        break;

      case 'monthly': {
        const day = input.startDate.getDate();
        parts.push(`BYMONTHDAY=${day}`);
        break;
      }

      case 'yearly': {
        const month = input.startDate.getMonth() + 1;
        const day = input.startDate.getDate();
        parts.push(`BYMONTH=${month}`);
        parts.push(`BYMONTHDAY=${day}`);
        break;
      }

      case 'lastDayOfMonth':
        // RFC 5545 erlaubt negative BYMONTHDAY-Werte, -1 = letzter Tag des Monats
        parts.push('BYMONTHDAY=-1');
        break    
    }

    return parts.join(';');
  }

  onAppointmentAdding(e: any) {
    console.log('Adding appointment:', e.appointmentData);
    const a = e.appointmentData;

    if (!a.repeatType || !a.until || !a.startDate) {
      a.recurrenceRule = '';
      return;
    }

    a.recurrenceRule = this.buildRecurrenceRule({
      repeatType: a.repeatType,
      interval: a.interval,
      until: a.until,
      weekdays: a.weekdays,
      startDate: a.startDate
    });
    console.log(a.recurrenceRule)
  }

}
