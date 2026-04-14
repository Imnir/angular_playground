export interface AppointmentDto {
  description: string;
  startDate: Date;
  endDate: Date | undefined;
  id: number;
  isActive: boolean;
  repeatType?: string;
  //isDeleted: boolean;
  //isNew: boolean;
  //packageId: number;
  period: string;
  recurrenceRule: string;
  text: string;
  weekdays: string[];
  //tooltip: any;
}